import type { Editor as TiptapEditor } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/react'

import { Separator } from '@camped-ui/separator'
import { cn } from '@camped-ui/lib'
import SectionOne from './section-1'
import SectionTwo from './section-2'
import SectionThree from './section-3'
import SectionFour from './section-4'

import { LinkBubbleMenu } from './bubble-menu/link-bubble-menu'

import { getOutput } from '../utils'
import { ImageBubbleMenu } from './bubble-menu/image-bubble-menu'
import { forwardRef } from 'react'
import { extensions } from './utils/tiptap-extensions'

export interface MinimalTiptapProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string | null
  outputValue?: 'html' | 'json' | 'text'
  disabled?: boolean
  contentClass?: string
  onValueChange: (value: string) => void
}

const MinimalTiptapEditor = forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, outputValue = 'html', disabled, contentClass, onValueChange, className, ...props }, ref) => {
    const editor = useEditor({
      extensions: extensions,
      editorProps: {
        attributes: {
          class: 'prose mx-auto focus:outline-none max-w-none prose-stone dark:prose-invert'
        }
      },
      onUpdate: props => {
        onValueChange(getOutput(props.editor, outputValue))
      },
      content: value,
      editable: !disabled,
      onCreate: ({ editor }) => {
        if (value) {
          editor.chain().setContent(value).run()
        }
      }
    })

    return (
      <div
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className
        )}
        {...props}
        ref={ref}
      >
        {editor && (
          <>
            <LinkBubbleMenu editor={editor} />
            <ImageBubbleMenu editor={editor} />
            <Toolbar editor={editor} />
          </>
        )}
        <div className="h-full grow" onClick={() => editor?.chain().focus().run()}>
          <EditorContent editor={editor} className={cn('p-5', contentClass)} />
        </div>
      </div>
    )
  }
)

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
  return (
    <div className="border-b border-border p-2">
      <div className="flex w-full flex-wrap items-center">
        <SectionOne editor={editor} />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionTwo editor={editor} />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionThree editor={editor} />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionFour editor={editor} />
      </div>
    </div>
  )
}

export { MinimalTiptapEditor }
