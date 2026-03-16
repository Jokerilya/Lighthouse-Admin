import { onBeforeUnmount, ref } from 'vue'

export function useWatermark() {
  const id = 'watermark-box'
  const watermarkRef = ref<HTMLElement | null>(null)

  const createWatermark = (text: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 250
    canvas.height = 150
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.rotate((-20 * Math.PI) / 180)
      ctx.font = '14px Arial'
      ctx.fillStyle = 'rgba(128, 128, 128, 0.15)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 50, 100)
    }
    return canvas.toDataURL('image/png')
  }

  const setWatermark = (text: string) => {
    if (watermarkRef.value) return
    
    const base64 = createWatermark(text)
    const watermarkDiv = document.createElement('div')
    watermarkDiv.id = id
    watermarkDiv.style.pointerEvents = 'none'
    watermarkDiv.style.top = '0'
    watermarkDiv.style.left = '0'
    watermarkDiv.style.position = 'fixed'
    watermarkDiv.style.zIndex = '9999'
    watermarkDiv.style.width = '100%'
    watermarkDiv.style.height = '100%'
    watermarkDiv.style.background = `url(${base64}) left top repeat`
    
    document.body.appendChild(watermarkDiv)
    watermarkRef.value = watermarkDiv

    // 防篡改: 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // 如果节点被删除或属性被修改，重新渲染
        const removed = Array.from(mutation.removedNodes).includes(watermarkDiv)
        const attributeChanged = mutation.type === 'attributes' && mutation.target === watermarkDiv
        
        if (removed || attributeChanged) {
          observer.disconnect()
          document.body.removeChild(watermarkDiv)
          watermarkRef.value = null
          setWatermark(text)
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'id']
    })
  }

  const clearWatermark = () => {
    if (watermarkRef.value) {
      document.body.removeChild(watermarkRef.value)
      watermarkRef.value = null
    }
  }

  onBeforeUnmount(() => {
    clearWatermark()
  })

  return { setWatermark, clearWatermark }
}
