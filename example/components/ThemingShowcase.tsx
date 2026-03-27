import { CSSProperties, defineComponent, ref } from 'vue'
import { HexColorPicker } from '@/index'
import CodeBlock from './CodeBlock'

interface PointerSlotProps {
  top: number
  left: number
  color: string
}

const CSS_VARIABLE_CODE = `.my-picker {
  --vc-accent-color: #ec4899;
  --vc-border-radius: 20px;
  --vc-pointer-size: 32px;
  --vc-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.2);
}`

const SATURATION_POINTER_STYLE: CSSProperties = {
  position: 'absolute',
  width: '20px',
  height: '20px',
  background: '#fff',
  border: '4px solid var(--demo-accent)',
  borderRadius: '9999px',
  transform: 'translate(-50%, -50%)',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)',
}

const HUE_POINTER_STYLE: CSSProperties = {
  ...SATURATION_POINTER_STYLE,
  width: '24px',
  height: '24px',
  borderColor: '#fff',
  background: 'var(--demo-accent)',
}

const SLOT_CODE = [
  'const saturationPointerStyle = {',
  "  position: 'absolute',",
  "  width: '20px',",
  "  height: '20px',",
  "  background: '#fff',",
  "  border: '4px solid var(--demo-accent)',",
  "  borderRadius: '9999px',",
  "  transform: 'translate(-50%, -50%)',",
  "  boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)',",
  '}',
  '',
  'const huePointerStyle = {',
  '  ...saturationPointerStyle,',
  "  width: '24px',",
  "  height: '24px',",
  "  borderColor: '#fff',",
  "  background: 'var(--demo-accent)',",
  '}',
  '',
  '<HexColorPicker',
  '  v-model={color.value}',
  '  showInput',
  "  style={{ width: '100%' }}",
  '  v-slots={{',
  "    'saturation-pointer': ({ top, left, color }) => (",
  '      <div',
  '        style={{',
  '          ...saturationPointerStyle,',
  '          top: `${top * 100}%`,',
  '          left: `${left * 100}%`,',
  '          borderColor: color,',
  '        }}',
  '      />',
  '    ),',
  "    'hue-pointer': ({ top, left }) => (",
  '      <div',
  '        style={{',
  '          ...huePointerStyle,',
  '          top: `${top * 100}%`,',
  '          left: `${left * 100}%`,',
  '        }}',
  '      />',
  '    ),',
  '  }}',
  '/>',
].join('\n')

export default defineComponent({
  name: 'ThemingShowcase',
  setup() {
    const themedColor = ref('#ec4899')
    const slotColor = ref('#3b82f6')

    return () => (
      <section id="theming" class="theming">
        <h2 class="section-title">Theming & Customization</h2>
        <p class="section-description">
          Override CSS variables for branding, or use slots to replace any pointer or track with
          your own component.
        </p>

        <div class="theming__grid">
          {/* CSS Variables */}
          <div class="theming__card">
            <div class="theming__card-header">
              <h3 class="theming__card-title">CSS Variables</h3>
            </div>
            <div class="theming__card-body">
              <div class="theming__preview">
                <HexColorPicker
                  v-model={themedColor.value}
                  showInput
                  style={{
                    '--vc-accent-color': '#ec4899',
                    '--vc-border-radius': '20px',
                    '--vc-pointer-size': '32px',
                    '--vc-shadow': '0 10px 15px -3px rgba(236, 72, 153, 0.2)',
                    width: '100%',
                  }}
                />
              </div>
              <CodeBlock code={CSS_VARIABLE_CODE} language="tsx" />
            </div>
          </div>

          {/* Custom Slots */}
          <div class="theming__card">
            <div class="theming__card-header">
              <h3 class="theming__card-title">Custom Slots</h3>
            </div>
            <div class="theming__card-body">
              <div class="theming__preview">
                <HexColorPicker
                  v-model={slotColor.value}
                  showInput
                  style={{ width: '100%' }}
                  v-slots={{
                    'saturation-pointer': ({ top, left, color }: PointerSlotProps) => (
                      <div
                        style={{
                          ...SATURATION_POINTER_STYLE,
                          top: `${top * 100}%`,
                          left: `${left * 100}%`,
                          borderColor: color,
                        }}
                      />
                    ),
                    'hue-pointer': ({ top, left }: PointerSlotProps) => (
                      <div
                        style={{
                          ...HUE_POINTER_STYLE,
                          top: `${top * 100}%`,
                          left: `${left * 100}%`,
                        }}
                      />
                    ),
                  }}
                />
              </div>
              <CodeBlock code={SLOT_CODE} language="tsx" />
            </div>
          </div>
        </div>
      </section>
    )
  },
})
