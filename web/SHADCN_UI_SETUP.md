# shadcn/ui Setup & UI Improvements

## ✅ Completed

### 1. Fixed Blue Outline Issue

- **File**: `web/src/styles/globals.css`
- **Change**: Added global focus styles to replace browser default blue outlines with custom green focus rings
- **Result**: All interactive elements now use `var(--tm-primary)` (green) for focus states instead of browser default blue

### 2. shadcn/ui Configuration

- **File**: `web/components.json`
- **Status**: Created configuration file for shadcn/ui CLI
- **Settings**:
  - Style: default
  - TypeScript: enabled
  - Tailwind: configured
  - Component path: `src/components/ui`

### 3. Utility Function

- **File**: `web/src/lib/utils.ts`
- **Purpose**: `cn()` function for merging Tailwind classes (required by shadcn/ui)
- **Uses**: `clsx` and `tailwind-merge`

### 4. Tailwind Config Updates

- **File**: `web/tailwind.config.ts`
- **Changes**:
  - Added `darkMode: ["class"]` for dark mode support
  - Added container configuration
  - Added `tailwindcss-animate` plugin

### 5. CSS Variables

- **File**: `web/src/styles/globals.css`
- **Added**: shadcn/ui CSS variables for theming

## 📦 Required Dependencies

You need to install the following packages:

```bash
cd web
npm install clsx tailwind-merge tailwindcss-animate
```

## 🚀 Next Steps

### 1. Install Dependencies

```bash
cd web
npm install clsx tailwind-merge tailwindcss-animate
```

### 2. Add shadcn/ui Components

Once dependencies are installed, you can add components using:

```bash
npx shadcn@latest add button
npx shadcn@latest add checkbox
npx shadcn@latest add input
npx shadcn@latest add card
# etc.
```

### 3. Migrate Existing Components (Optional)

Consider migrating custom components to shadcn/ui for:

- Better accessibility
- Consistent styling
- Easier maintenance
- Better TypeScript support

### 4. Recommended Components to Add

- `button` - Replace custom Button component
- `checkbox` - Replace custom Checkbox component
- `input` - Replace custom Input component
- `card` - For consistent card styling
- `tabs` - Already using @headlessui, but shadcn tabs are more customizable
- `dialog` - For modals
- `form` - Better form handling with react-hook-form integration

## 📝 Notes

- The blue outline issue is now fixed - all focus states use green (`--tm-primary`)
- shadcn/ui is configured but not yet active (needs dependencies)
- Existing custom components continue to work
- You can gradually migrate to shadcn/ui components as needed

## 🔍 Current UI Stack

- ✅ Tailwind CSS (configured)
- ✅ @headlessui/react (for tabs, modals)
- ✅ Custom components (Button, Checkbox, Input, etc.)
- ⚠️ Material-UI (installed but not consistently used)
- ✅ shadcn/ui (configured, ready to use after installing dependencies)
