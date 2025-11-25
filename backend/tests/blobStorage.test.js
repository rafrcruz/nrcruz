import { describe, it, expect, beforeEach, vi } from 'vitest';

const putMock = vi.fn();
const delMock = vi.fn();
const listMock = vi.fn();

const loadModule = async (configOverrides = {}) => {
  vi.resetModules();
  vi.doMock('@vercel/blob', () => ({ put: putMock, del: delMock, list: listMock }), {
    virtual: true,
  });
  const blobStorage = await import('../src/utils/blobStorage');
  blobStorage.__setBlobConfig({
    token: 'test-token',
    baseUrl: 'https://blob.example.com',
    ...configOverrides,
  });
  return blobStorage;
};

beforeEach(() => {
  putMock.mockReset();
  delMock.mockReset();
  listMock.mockReset();
});

describe('blobStorage utils', () => {
  it('throws when upload is attempted without token', async () => {
    const blobStorage = await loadModule({ token: '' });

    await expect(blobStorage.uploadBlob({ key: 'file.txt', data: 'payload' })).rejects.toThrow(
      'BLOB_READ_WRITE_TOKEN is not configured'
    );
  });

  it('uploads blob with normalized key and fallback public url', async () => {
    putMock.mockResolvedValue({ url: undefined });
    const blobStorage = await loadModule();

    const result = await blobStorage.uploadBlob({
      key: '/folder/file.txt',
      data: 'payload',
      contentType: 'text/plain',
    });

    expect(putMock).toHaveBeenCalledWith('folder/file.txt', 'payload', {
      access: 'public',
      contentType: 'text/plain',
      token: 'test-token',
    });
    expect(result.publicUrl).toBe('https://blob.example.com/folder/file.txt');
  });

  it('rejects upload when key is missing', async () => {
    const blobStorage = await loadModule();
    await expect(blobStorage.uploadBlob({ data: 'payload' })).rejects.toThrow(
      'uploadBlob: "key" is required.'
    );
  });

  it('deletes using provided url without rewriting', async () => {
    delMock.mockResolvedValue({});
    const blobStorage = await loadModule();

    await blobStorage.deleteBlob('https://blob.example.com/path/file.txt');

    expect(delMock).toHaveBeenCalledWith('https://blob.example.com/path/file.txt', {
      token: 'test-token',
    });
  });

  it('deletes using key by resolving the public url', async () => {
    delMock.mockResolvedValue({});
    const blobStorage = await loadModule();

    const result = await blobStorage.deleteBlob('/path/file.txt');

    expect(delMock).toHaveBeenCalledWith('https://blob.example.com/path/file.txt', {
      token: 'test-token',
    });
    expect(result).toEqual({ deleted: true, target: 'https://blob.example.com/path/file.txt' });
  });

  it('rejects delete when no url or key is provided', async () => {
    const blobStorage = await loadModule();
    await expect(blobStorage.deleteBlob()).rejects.toThrow('deleteBlob: "urlOrKey" is required.');
  });

  it('lists blobs with normalized prefix', async () => {
    listMock.mockResolvedValue([{ url: 'https://blob.example.com/item' }]);
    const blobStorage = await loadModule();

    const result = await blobStorage.listBlobs('/nested/');

    expect(listMock).toHaveBeenCalledWith({ token: 'test-token', prefix: 'nested/' });
    expect(result).toEqual([{ url: 'https://blob.example.com/item' }]);
  });

  it('lists blobs without prefix', async () => {
    listMock.mockResolvedValue([]);
    const blobStorage = await loadModule();

    await blobStorage.listBlobs();

    expect(listMock).toHaveBeenCalledWith({ token: 'test-token', prefix: undefined });
  });

  it('reuses the blob sdk instance across calls', async () => {
    putMock.mockResolvedValue({ url: 'https://blob.example.com/first.txt' });
    delMock.mockResolvedValue({});
    const blobStorage = await loadModule();

    await blobStorage.uploadBlob({ key: 'first.txt', data: 'payload' });
    await blobStorage.deleteBlob('second.txt');

    expect(putMock).toHaveBeenCalledTimes(1);
    expect(delMock).toHaveBeenCalledTimes(1);
  });
});
