import { Plugin, TextSelection } from '@tiptap/pm/state'
import { getMarkRange } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageViewBlock } from '../image/image-view-block'
import ImageResize from 'tiptap-extension-resize-image'

export const extensions = [
  StarterKit,
  Image.extend({
    addNodeView() {
      return ReactNodeViewRenderer(ImageViewBlock)
    }
  }),
  ImageResize,
  Link.configure({
    openOnClick: false
  }).extend({
    // https://github.com/ueberdosis/tiptap/issues/2571
    inclusive: false,

    addProseMirrorPlugins() {
      return [
        new Plugin({
          // mark the link
          props: {
            handleClick(view, pos) {
              const { schema, doc, tr } = view.state
              const range = getMarkRange(doc.resolve(pos), schema.marks.link)

              if (!range) {
                return
              }

              const { from, to } = range
              const start = Math.min(from, to)
              const end = Math.max(from, to)

              if (pos < start || pos > end) {
                return
              }

              const $start = doc.resolve(start)
              const $end = doc.resolve(end)
              const transaction = tr.setSelection(new TextSelection($start, $end))

              view.dispatch(transaction)
            }
          }
        })
      ]
    }
  })
]
