import { Bucket, Storage } from '@google-cloud/storage';
import { Packager } from 'app-builder-lib';
import { Arch } from 'builder-util';
import { HttpPublisher, PublishContext, UploadTask } from 'electron-publish';
import { createReadStream } from 'fs-extra-p';
import { basename, join } from 'path';

interface IServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
}

interface IGCSPublisherConfig {
  bucket: string;
  path: string;
  serviceAccount: IServiceAccount;
  public: boolean;
  resumable: boolean;
}
interface INewPublishContext extends PublishContext {
  readonly packager: Packager;
}
interface INewUploadTask extends UploadTask {
  readonly packager: Packager;
}
export default class GCSPublisher extends HttpPublisher {
  public readonly providerName = 'gcs';
  protected useSafeName: boolean = true;
  protected readonly context!: INewPublishContext;
  protected storage: Storage;
  protected bucket: Bucket;
  protected constructor(
    context: INewPublishContext,
    useSafeArtifactName?: boolean
  ) {
    super(context);
    const config = this.getConfig();
    this.useSafeName = useSafeArtifactName || true;
    this.storage = new Storage({
      autoRetry: true,
      credentials: config.serviceAccount,
      projectId: config.serviceAccount.project_id
    });
    this.bucket = this.storage.bucket(config.bucket);
  }
  public async upload(task: INewUploadTask): Promise<any> {
    const fileName =
      (this.useSafeName ? task.safeArtifactName : null) || basename(task.file);
    const os = task.packager['platform'].name;
    await this.doUpload(fileName, task.file, task.arch || Arch.x64, os);
  }

  public async doUpload(fileName, filePath, arch, os) {
    const config = this.getConfig();

    const appInfo = this.context.packager.appInfo;
    const archName = Arch[arch];
    const key = config.path
      .replace(/\${name}/g, appInfo.name)
      .replace(/\${os}/g, os)
      .replace(/\${arch}/g, archName)
      .replace(/\${filename}/g, fileName);
    this.context.cancellationToken.createPromise((resolve, reject) => {
      const file = this.bucket.file(key).createWriteStream({
        public: config.public,
        resumable: config.resumable
      });
      createReadStream(filePath).pipe(file);
      file.on('finish', resolve);
      file.on('error', reject);
    });
  }

  public toString() {
    return `${this.providerName} (bucket: ${this.getBucketName()})`;
  }

  protected getConfig(): IGCSPublisherConfig {
    const packageContent = require(join(
      this.context.packager.appDir,
      'package.json'
    ));
    const config = {
      path: '/${name}/${os}/${arch}/${filename}',
      public: true,
      resumable: true,
      ...packageContent['publish-gcs']
    };
    if (typeof config.serviceAccount === 'string') {
      config.serviceAccount = require(config.serviceAccount);
    }
    return config;
  }
  protected getBucketName(): string {
    return this.getConfig().bucket;
  }
}
