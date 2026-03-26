# AGENTS.md

## 🤖 AI Role & Core Objective

You are an expert Vue 3 and TypeScript developer.
Your goal is to assist in developing `vue3-colorful`, a lightweight, composable-based Vue 3 color picker component library.
**CRITICAL: This project is strictly written in TSX. Do NOT generate or suggest Vue Single File Components (SFCs / `.vue` files) under any circumstances.**

---

## 项目概览

`vue3-colorful` 是一个轻量级 Vue 3 颜色选择器组件库，支持 HEX / RGB / HSL / HSV / CMYK 格式。

**关键约定（先读这里）**

- 组件全部用 **TSX**（`defineComponent` + render function），**禁止写 `.vue` SFC 文件**
- **禁止 Options API**，统一使用 `setup()` 返回渲染函数
- 包管理器：**`pnpm`**，禁止混用 npm / yarn
- TypeScript 严格模式，**禁止 `any`**

---

## 常用命令

### 开发

```bash
pnpm install           # 安装依赖
pnpm dev               # 启动 Vite 开发服务器
pnpm build             # 生产构建（vite build + vue-tsc 类型声明）
pnpm build:example     # 构建示例应用
```

### 提交前必跑（三项全通过才可提交）

```bash
pnpm type-check        # TypeScript 类型检查（vue-tsc --noEmit）
pnpm lint              # ESLint 自动修复
pnpm format            # Prettier 格式化（仅 src/）
```

### 测试

```bash
pnpm test              # 监听模式（vitest）
pnpm test:run          # 单次运行
pnpm test:coverage     # 覆盖率报告（阈值 80%，不得降低）

pnpm vitest run test/color-picker.test.ts   # 跑单个文件
pnpm vitest -t "renders correctly"          # 按名称过滤

pnpm test:visual                # 视觉回归测试
pnpm test:visual:update         # 更新快照
```

---

## 编码规范

### 组件写法（TSX，唯一合法写法）

```tsx
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentName', // 必须显式声明
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    // 响应式状态、watcher 等
    return () => <div class="vue3-colorful__wrapper">{/* JSX 内容 */}</div>
  },
})
```

**禁止事项**

| ❌ 禁止            | ✅ 替代                               |
| ------------------ | ------------------------------------- |
| `.vue` SFC 文件    | `.tsx` 文件                           |
| Options API        | `setup()` + render function           |
| `any` 类型         | 显式类型 / `unknown` + 收窄           |
| `==` 判断 null     | `===` 或可选链 `?.`                   |
| 裸 `console.error` | `console.warn('[vue3-colorful] ...')` |
| 硬编码 CSS 色值    | CSS 变量                              |

### Composables

- 文件名：`use` 前缀 + camelCase（`useColorState.ts`）
- 参数和返回值必须定义 **typed interface**

```tsx
interface UseColorStateOptions {
  /* ... */
}
interface UseColorStateReturn {
  /* ... */
}

export function useColorState(options: UseColorStateOptions): UseColorStateReturn {
  return { hsva, outputValue, handleSaturation }
}
```

### Props 约定

- v-model 统一用 `modelValue` / `update:modelValue`
- 复杂类型用 `PropType<T>`
- 传入 composable 前用 `toRef()` 包裹

### 导入顺序

```tsx
// 1. Vue
import { defineComponent, ref, watch } from 'vue'

// 2. 内部 composables / 类型（使用 @/ 别名）
import { useColorState } from '@/composables/useColorState'
import type { HsvaColor } from '@/types'

// 3. 相对路径（同模块）
import Pointer from './Pointer'
import { clamp } from '../utils/clamp'
```

路径别名：`@/` 和 `~/` 均解析到 `./src/`。

### 命名约定

| 类型            | 规范                         | 示例                              |
| --------------- | ---------------------------- | --------------------------------- |
| 组件文件        | `PascalCase.tsx`             | `ColorPicker.tsx`                 |
| Composable 文件 | `use` + camelCase            | `useColorState.ts`                |
| 工具函数文件    | camelCase                    | `converter.ts`                    |
| CSS 类名        | BEM，`.vue3-colorful__` 前缀 | `.vue3-colorful__pointer--active` |

### 错误处理

```tsx
try {
  hsva.value = parseColor(newValue)
} catch {
  console.warn(`[vue3-colorful] Invalid color value: ${newValue}`)
}
```

- 可恢复错误：`console.warn` + `[vue3-colorful]` 前缀
- 仅开发环境警告：用 `process.env.NODE_ENV !== 'production'` 守卫
- 刻意忽略的错误：catch 块可留空，但须加注释说明原因

---

## 测试规范

框架：**Vitest + jsdom + @vue/test-utils**，globals 已开启。

```tsx
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '../src/path/Component'

describe('ComponentName', () => {
  describe('feature group', () => {
    it('does something', () => {
      const wrapper = mount(Component, {
        props: {
          /* ... */
        },
      })
      expect(wrapper.find('.vue3-colorful__element').exists()).toBe(true)
    })
  })
})
```

- 测试文件位置：`test/*.test.ts`
- 触发事件：`wrapper.vm.$emit()` 或 `findComponent().vm.$emit()`
- 读取事件：`wrapper.emitted('eventName')`
- **覆盖率阈值 80%，不得下调，新增代码必须附带测试**

---

## Git 工作流

- 分支命名：`feature/xxx`、`fix/xxx`、`chore/xxx`
- Commit 格式：Conventional Commits（`feat:`、`fix:`、`chore:`、`docs:`、`style:`）
- Pre-commit hook 自动执行 `pnpm lint-staged`（ESLint + Prettier 处理暂存文件）
- **覆盖率不得低于 80%，否则 CI 失败**

---

## 禁区（未经授权不得修改）

| 路径                            | 原因                             |
| ------------------------------- | -------------------------------- |
| `*.vue`                         | 项目不使用 SFC，若出现则为误操作 |
| `vite.config.ts` 的构建入口配置 | 影响库的产物格式                 |
| `package.json` → `version` 字段 | 由发布流程管理                   |
