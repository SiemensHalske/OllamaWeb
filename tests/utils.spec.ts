import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateWithImage, generate } from '../utils/GenerateCodeClient'
import { generatePrompt } from '../utils/GeneratePromptServer'
import { generateCode } from '../utils/GenerateCodeServer'

describe('GenerateCodeClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generateWithImage posts correct body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({})
    ;(globalThis as any).$fetch = fetchMock
    await generateWithImage('imgdata', 'hello')
    expect(fetchMock).toHaveBeenCalledWith('/api/generate', {
      method: 'post',
      body: { image: 'imgdata', prompt: 'hello' }
    })
  })

  it('generate posts correct body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({})
    ;(globalThis as any).$fetch = fetchMock
    await generate('hi', '123')
    expect(fetchMock).toHaveBeenCalledWith('/api/generate/123', {
      method: 'post',
      body: { prompt: 'hi' }
    })
  })
})

describe('Server utilities', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generatePrompt returns description', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        message: { tool_calls: [{ function: { arguments: { description: 'desc' } } }] }
      })
    } as any)
    const res = await generatePrompt('img')
    expect(res).toBe('desc')
  })

  it('generateCode returns code', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        message: { tool_calls: [{ function: { arguments: { content: '<html></html>' } } }] }
      })
    } as any)
    const res = await generateCode('prompt')
    expect(res).toBe('<html></html>')
  })
})
