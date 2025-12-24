/**
 * ExportEngine.js - CamTech v1.7
 * Full layer compositing for final image export
 * Order: photo → strokes → stickers → emojis → text
 */

// Brush sizes (must match DrawTool.jsx)
const BRUSH_SIZES = {
    small: 4,
    medium: 8
}

// Font definitions (must match TextEditor.jsx)
const FONTS = {
    classic: '-apple-system, BlinkMacSystemFont, sans-serif',
    bold: '-apple-system, BlinkMacSystemFont, sans-serif',
    serif: 'Georgia, Times New Roman, serif',
    mono: 'SF Mono, Menlo, monospace',
    condensed: 'Arial Narrow, sans-serif',
    script: 'Snell Roundhand, cursive'
}

/**
 * Draw all strokes onto canvas
 */
function drawStrokes(ctx, strokes, scale = 1) {
    strokes.forEach(stroke => {
        if (stroke.points.length < 2) return

        ctx.beginPath()
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = (BRUSH_SIZES[stroke.size] || BRUSH_SIZES.small) * scale
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.moveTo(stroke.points[0].x * scale, stroke.points[0].y * scale)
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x * scale, stroke.points[i].y * scale)
        }
        ctx.stroke()
    })
}

/**
 * Draw a sticker element onto canvas
 * DOM Anchor: Top-Left (x,y)
 * Pivot: Center
 */
function drawSticker(ctx, element, scale = 1) {
    const x = element.x * scale
    const y = element.y * scale
    const size = 80 * element.scale * scale
    const halfSize = size / 2

    ctx.save()

    // 1. Move to Top-Left (DOM position)
    ctx.translate(x, y)

    // 2. Move pivot to Center
    ctx.translate(halfSize, halfSize)

    // 3. Rotate around Center
    ctx.rotate((element.rotation * Math.PI) / 180)

    // 4. Move back to Top-Left relative coordinate space
    ctx.translate(-halfSize, -halfSize)

    // Render Emoji Icon directly
    // Fallback chain: content (new) -> icon (sticker drawer) -> default
    const content = element.data?.content || element.data?.icon || '⭐'

    ctx.font = `${48 * element.scale * scale}px -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Draw at center of the box (width/2, height/2)
    ctx.fillText(content, halfSize, halfSize + (4 * element.scale * scale)) // slight y-offset for emoji baseline

    ctx.restore()
}

/**
 * Draw an emoji element onto canvas
 * DOM Anchor: Top-Left (x,y)
 * Pivot: Center
 */
/**
 * Draw an emoji element onto canvas
 * DOM Anchor: Top-Left (x,y)
 * Pivot: Center
 */
function drawEmoji(ctx, element, scale = 1) {
    const x = element.x * scale
    const y = element.y * scale
    // DOM uses same box size class as stickers (80px) per user request
    const size = 80 * element.scale * scale
    const halfSize = size / 2
    const fontSize = 48 * element.scale * scale

    ctx.save()

    // 1. Move to Top-Left
    ctx.translate(x, y)

    // 2. Pivot to Center (based on 80px box)
    ctx.translate(halfSize, halfSize)
    ctx.rotate((element.rotation * Math.PI) / 180)
    ctx.translate(-halfSize, -halfSize)

    ctx.font = `${fontSize}px -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // Use data.emoji per requirement, draw at center of 80px box
    ctx.fillText(element.data?.emoji || '😊', halfSize, halfSize + (2 * element.scale * scale))

    ctx.restore()
}

/**
 * Draw a text element onto canvas with full styling and wrapping
 * DOM Anchor: Top-Left (x,y)
 * Pivot: Center
 */
function drawText(ctx, element, scale = 1) {
    const x = element.x * scale
    const y = element.y * scale
    const style = element.data?.style || {}
    const text = element.data?.text || ''

    const fontFamily = FONTS[style.fontId] || FONTS.classic
    const fontWeight = style.fontId === 'bold' ? '700' : '400'
    const fontSize = 24 * element.scale * scale
    const lineHeight = fontSize * 1.3
    // DOM max-width is 280px
    const maxWidth = 280 * element.scale * scale

    // 1. Prepare wrapped lines first to measure bounds
    // Temporary context settings for measurement
    ctx.save()
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    const lines = wrapText(ctx, text, maxWidth)

    // 2. Measure dimensions
    let maxLineWidth = 0
    lines.forEach(line => {
        const w = ctx.measureText(line).width
        if (w > maxLineWidth) maxLineWidth = w
    })

    // Even if text is short, DOM text box might be defined by visual bounds
    // For "Instagram style", the box usually shrink-wraps the widest line.
    // We'll treat the box size as (maxLineWidth x totalHeight).
    const totalHeight = lines.length * lineHeight

    ctx.restore() // Restore context state

    // 3. Transform Logic
    // Box dimensions
    const boxWidth = maxLineWidth
    const boxHeight = totalHeight
    const halfW = boxWidth / 2
    const halfH = boxHeight / 2

    ctx.save()

    // Move to Top-Left (x,y)
    ctx.translate(x, y)

    // Move pivot to Center of the text block
    ctx.translate(halfW, halfH)

    // Rotate
    ctx.rotate((element.rotation * Math.PI) / 180)

    // Move back to Top-Left of the text block
    ctx.translate(-halfW, -halfH)

    // 4. Draw Lines
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = (style.styleMode === 'normal' || !style.styleMode) ? 'rgba(0,0,0,0.5)' : 'transparent'
    ctx.shadowBlur = (style.styleMode === 'normal' || !style.styleMode) ? 3 * scale : 0
    ctx.shadowOffsetY = 1 * scale

    // Background/Highlight Padding logic
    const color = style.color || '#fff'

    // Draw each line
    lines.forEach((line, i) => {
        // Line specific dimensions
        const lineY = (i * lineHeight) + (lineHeight / 2) // Center of the line
        // All lines centered in the X-axis of the block? 
        // DOM text-align: center. So yes, always center in the block.
        const lineX = halfW

        // Backgrounds (Line-by-line for Highlight/Background style support)
        if (style.styleMode === 'background' || style.styleMode === 'highlight') {
            const lineWidth = ctx.measureText(line).width
            const padding = (style.styleMode === 'highlight' ? 12 : 8) * scale
            const bgFill = style.styleMode === 'highlight' ? color : color
            const radius = (style.styleMode === 'background' ? 4 : 8) * scale

            ctx.fillStyle = bgFill
            ctx.beginPath()
            ctx.roundRect(
                lineX - lineWidth / 2 - padding,
                lineY - lineHeight / 2 - (style.styleMode === 'highlight' ? padding / 4 : 0),
                lineWidth + padding * 2,
                lineHeight + (style.styleMode === 'highlight' ? padding / 2 : 0),
                radius
            )
            ctx.fill()
        }

        // Text
        const textFill = (style.styleMode === 'background' || style.styleMode === 'highlight')
            ? ((color === '#FFFFFF' || color === '#FFCC00') ? '#000' : '#FFF')
            : color

        ctx.fillStyle = textFill
        if (style.styleMode === 'stroke') {
            ctx.strokeStyle = color
            ctx.lineWidth = 2 * scale
            ctx.strokeText(line, lineX, lineY)
        }
        ctx.fillText(line, lineX, lineY)
    })

    ctx.restore()
}

/**
 * Helper: Wrap text by explicit newlines AND width
 * Supports 'break-word' style splitting for long words
 */
function wrapText(ctx, text, maxWidth) {
    const lines = []
    const paragraphs = text.split('\n')

    for (const paragraph of paragraphs) {
        if (paragraph === '') {
            lines.push('')
            continue
        }

        const words = paragraph.split(' ')
        let currentLine = ''

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const metrics = ctx.measureText(testLine)

            if (metrics.width > maxWidth) {
                // If the word itself is longer than maxWidth, we must split it (break-word)
                const wordWidth = ctx.measureText(word).width
                if (wordWidth > maxWidth) {
                    // Push current line if it exists
                    if (currentLine) {
                        lines.push(currentLine)
                        currentLine = ''
                    }

                    // Split the long word manually
                    let remainingWord = word
                    while (remainingWord.length > 0) {
                        let i = 1
                        // Find max length that fits
                        while (i <= remainingWord.length && ctx.measureText(remainingWord.slice(0, i)).width <= maxWidth) {
                            i++
                        }

                        // Valid chunk is i-1
                        const validLen = (i > 1) ? i - 1 : 1
                        const chunk = remainingWord.slice(0, validLen)

                        lines.push(chunk)
                        remainingWord = remainingWord.slice(validLen)
                    }
                } else {
                    // Normal wrap
                    lines.push(currentLine)
                    currentLine = word
                }
            } else {
                currentLine = testLine
            }
        }
        if (currentLine) lines.push(currentLine)
    }
    return lines.length ? lines : ['']
}

/**
 * Main export function - composites all layers into final image
 * Order: frozen frame → strokes → stickers → emojis → text
 * @param {Object} params
 * @param {HTMLCanvasElement} params.baseCanvas - Frozen frame canvas
 * @param {Array} params.strokes - Array of stroke objects
 * @param {Array} params.elements - Array of placed elements
 * @param {number} params.displayWidth - Display width of canvas
 * @param {number} params.displayHeight - Display height of canvas
 * @returns {Promise<{dataURL: string, blob: Blob}>}
 */
export async function exportImage({ baseCanvas, strokes, elements, displayWidth, displayHeight }) {
    // Get actual canvas dimensions (includes DPR)
    const width = baseCanvas.width
    const height = baseCanvas.height
    const dpr = width / displayWidth || 1

    // Create export canvas at full resolution
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = width
    exportCanvas.height = height
    const ctx = exportCanvas.getContext('2d')

    // Scale for high DPI
    const scale = dpr

    // Layer 1: Draw frozen frame
    ctx.drawImage(baseCanvas, 0, 0)

    // Layer 2: Draw strokes
    if (strokes.length > 0) {
        drawStrokes(ctx, strokes, scale)
    }

    // Layer 3 & 4: Draw elements in order (stickers, emojis, then text)
    // Sort by type to ensure correct z-order
    const sortedElements = [...elements].sort((a, b) => {
        const order = { sticker: 0, emoji: 1, text: 2 }
        return (order[a.type] || 0) - (order[b.type] || 0)
    })

    sortedElements.forEach(element => {
        if (element.type === 'sticker') {
            drawSticker(ctx, element, scale)
        } else if (element.type === 'emoji') {
            drawEmoji(ctx, element, scale)
        } else if (element.type === 'text') {
            drawText(ctx, element, scale)
        }
    })

    // Generate output
    const dataURL = exportCanvas.toDataURL('image/png', 1.0)

    // Convert to blob
    return new Promise((resolve, reject) => {
        exportCanvas.toBlob((blob) => {
            if (blob) {
                resolve({ dataURL, blob })
            } else {
                reject(new Error('Failed to create image blob'))
            }
        }, 'image/png', 1.0)
    })
}

/**
 * Share the exported image using Web Share API
 * No download fallback - Web Share only
 */
export async function shareImage(blob, dataURL) {
    // Check if Web Share API with files is supported
    if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'image.png', { type: 'image/png' })] })) {
        try {
            const file = new File([blob], 'hikari-camtech.png', { type: 'image/png' })
            await navigator.share({
                files: [file],
                title: 'Hikari CamTech',
                text: 'Created with Hikari CamTech Engine'
            })
            return { shared: true }
        } catch (error) {
            if (error.name === 'AbortError') {
                // User cancelled share
                return { shared: false, cancelled: true }
            }
            // Share failed for other reason
            return { shared: false, error: true }
        }
    }

    // Web Share not supported - no download fallback
    return { shared: false, notSupported: true }
}

/**
 * Full export and share flow
 */
export async function exportAndShare({ baseCanvas, strokes, elements, displayWidth, displayHeight }) {
    // Export image
    const { dataURL, blob } = await exportImage({
        baseCanvas,
        strokes,
        elements,
        displayWidth,
        displayHeight
    })

    // Share
    const result = await shareImage(blob, dataURL)

    return {
        ...result,
        dataURL
    }
}

/**
 * CamTech v2.0: Generate final export payload (does NOT share)
 * Returns payload for Review screen display
 */
export async function generateFinalBlob({ baseCanvas, strokes, elements, displayWidth, displayHeight }) {
    const { dataURL, blob } = await exportImage({
        baseCanvas,
        strokes,
        elements,
        displayWidth,
        displayHeight
    })

    // Create object URL for efficient preview display
    const objectUrl = URL.createObjectURL(blob)

    return {
        blob,
        dataURL,
        objectUrl,
        width: baseCanvas.width,
        height: baseCanvas.height,
        mime: 'image/png',
        createdAt: Date.now()
    }
}

/**
 * CamTech v2.0: Trigger share (returns to Review on cancel)
 */
export async function triggerShare(payload) {
    return shareImage(payload.blob, payload.dataURL)
}
