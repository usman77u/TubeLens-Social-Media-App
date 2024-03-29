export type DeepHashChunk = Uint8Array | AsyncIterable<Buffer> | DeepHashChunk[]
export type DeepHashChunks = DeepHashChunk[]

const deepHashChunks = async (
  chunks: DeepHashChunks,
  acc: Uint8Array
): Promise<Uint8Array> => {
  if (chunks.length < 1) {
    return acc
  }

  // eslint-disable-next-line no-use-before-define
  const hashPair = Buffer.concat([acc, await deepHash(chunks[0])])
  const newAcc = Buffer.from(await crypto.subtle.digest('SHA-384', hashPair))
  return await deepHashChunks(chunks.slice(1), newAcc)
}

export const deepHash = async (data: DeepHashChunk): Promise<Uint8Array> => {
  if (
    typeof (data as AsyncIterable<Buffer>)[Symbol.asyncIterator] === 'function'
  ) {
    const _data = data as AsyncIterable<Buffer>
    let length = 0

    for await (const chunk of _data) {
      length += chunk.byteLength
    }

    const tag = Buffer.concat([
      Buffer.from('blob', 'utf-8'),
      Buffer.from(length.toString(), 'utf-8')
    ])
    const taggedHash = Buffer.concat([
      Buffer.from(await crypto.subtle.digest('SHA-384', tag))
    ])

    return Buffer.from(await crypto.subtle.digest('SHA-384', taggedHash))
  } else if (Array.isArray(data)) {
    const tag = Buffer.concat([
      Buffer.from('list', 'utf-8'),
      Buffer.from(data.length.toString(), 'utf-8')
    ])

    return await deepHashChunks(
      data,
      Buffer.from(await crypto.subtle.digest('SHA-384', tag))
    )
  }

  const _data = data as Uint8Array
  const tag = Buffer.concat([
    Buffer.from('blob', 'utf-8'),
    Buffer.from(_data.byteLength.toString(), 'utf-8')
  ])
  const taggedHash = Buffer.concat([
    Buffer.from(await crypto.subtle.digest('SHA-384', tag)),
    Buffer.from(await crypto.subtle.digest('SHA-384', _data))
  ])

  return Buffer.from(await crypto.subtle.digest('SHA-384', taggedHash))
}

export default deepHash
