import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from '../components/ChatMessage.vue'
import OutputView from '../components/OutputView.vue'

describe('ChatMessage', () => {
  it('renders user text message', () => {
    const wrapper = mount(ChatMessage, {
      props: { message: { content: 'Hello', user: true, image: false } },
      slots: { default: 'Hello' }
    })
    expect(wrapper.find('.text').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.find('.userMessage').exists()).toBe(true)
  })
})

describe('OutputView', () => {
  it('copies fetched content to clipboard', async () => {
    const fetchMock = vi.fn().mockResolvedValue('file content')
    ;(globalThis as any).$fetch = fetchMock
    const writeMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText: writeMock } })
    const wrapper = mount(OutputView, { props: { contentUrl: '/file.html' } })
    await (wrapper.vm as any).copy()
    expect(fetchMock).toHaveBeenCalledWith('/file.html', { responseType: 'text' })
    expect(writeMock).toHaveBeenCalledWith('file content')
  })
})
