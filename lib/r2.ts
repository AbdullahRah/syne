import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 helpers (S3-compatible). SERVER-ONLY — never import into a
 * Client Component. Credentials come from an R2 API token (Object Read & Write).
 */

const BUCKET = process.env.R2_BUCKET_NAME!;

let _client: S3Client | null = null;

function r2(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  return _client;
}

/**
 * Presigned PUT URL — the browser uploads a file directly to R2, so the
 * bytes never pass through our server. Scope keys as `${businessId}/${mediaId}`.
 */
export function signUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 60 * 10,
) {
  return getSignedUrl(
    r2(),
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
    { expiresIn },
  );
}

/**
 * Short-lived presigned GET URL for playback on the TV client. Regenerated
 * whenever the display re-polls (default 1 hour).
 */
export function signDownloadUrl(key: string, expiresIn = 60 * 60) {
  return getSignedUrl(
    r2(),
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn },
  );
}

export function deleteObject(key: string) {
  return r2().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
