const { config } = require('../config/env');

let blobSdkPromise;
const getBlobSdk = () => {
  if (!blobSdkPromise) {
    blobSdkPromise = import('@vercel/blob');
  }
  return blobSdkPromise;
};

const requireToken = () => {
  if (!config.blobStorage.token) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not configured. Set it in the environment before using blob storage.'
    );
  }
};

const normalizeKey = key => key.replace(/^\/+/, '');
const resolvePublicUrl = key => `${config.blobStorage.baseUrl}/${normalizeKey(key)}`;

const uploadBlob = async ({
  key,
  data,
  contentType = 'application/octet-stream',
  access = 'public',
}) => {
  requireToken();

  if (!key) {
    throw new Error('uploadBlob: "key" is required.');
  }

  const { put } = await getBlobSdk();
  const normalizedKey = normalizeKey(key);
  const result = await put(normalizedKey, data, {
    access,
    contentType,
    token: config.blobStorage.token,
  });

  return {
    ...result,
    publicUrl: result?.url || resolvePublicUrl(normalizedKey),
  };
};

const deleteBlob = async urlOrKey => {
  requireToken();

  if (!urlOrKey) {
    throw new Error('deleteBlob: "urlOrKey" is required.');
  }

  const { del } = await getBlobSdk();
  const target = urlOrKey.startsWith('http') ? urlOrKey : resolvePublicUrl(urlOrKey);

  await del(target, { token: config.blobStorage.token });
  return { deleted: true, target };
};

const listBlobs = async prefix => {
  requireToken();
  const { list } = await getBlobSdk();
  const normalizedPrefix = prefix ? normalizeKey(prefix) : undefined;
  return list({ token: config.blobStorage.token, prefix: normalizedPrefix });
};

module.exports = {
  uploadBlob,
  deleteBlob,
  listBlobs,
  resolvePublicUrl,
  __setBlobConfig: overrides => {
    if (!overrides) return;
    if (overrides.token !== undefined) config.blobStorage.token = overrides.token;
    if (overrides.baseUrl !== undefined) config.blobStorage.baseUrl = overrides.baseUrl;
  },
};
