<template>
  <div class="editor">
    <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor" class="editor__menu">
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="editor__button">
        <icon name="editorH1" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="editor__button">
        <icon name="editorH2" />
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="editor__button">
        <icon name="editorQuota" />
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="editor__button">
        <icon name="listBullet" />
      </button>
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="editor__button">
        <icon name="editorBold" />
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" class="editor__button">
        <icon name="editorUnderline" />
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="editor__button">
        <icon name="editorItalic" />
      </button>
      <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }" class="editor__button">
        <icon name="link" />
      </button>
    </bubble-menu>
    <floating-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor" class="editor__menu">
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="editor__button">
        <icon name="editorH1" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" class="editor__button">
        <icon name="editorH2" />
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="editor__button">
        <icon name="editorQuota" />
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="editor__button">
        <icon name="listBullet" />
      </button>
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="editor__button">
        <icon name="editorBold" />
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" class="editor__button">
        <icon name="editorUnderline" />
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="editor__button">
        <icon name="editorItalic" />
      </button>
      <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }" class="editor__button">
        <icon name="link" />
      </button>
      <button @click="setTable" class="editor__button">
        <icon name="editorTable" />
      </button>
      <button @click="setImage" class="editor__button">
        <icon name="editorImage" />
      </button>
      <button v-if="!showVideo" @click="setVideo" class="editor__button">
        <icon name="editorVideo" />
      </button>
    </floating-menu>
    <editor-content :editor="editor" class="editor__content" />
    <div v-if="modelValue === '' || modelValue === '<p></p>'" class="editor__placeholder">Напишите текст здесь</div>
  </div>
</template>

<script>
  import StarterKit from '@tiptap/starter-kit'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'
  import Table from '@tiptap/extension-table'
  import TableCell from '@tiptap/extension-table-cell'
  import TableHeader from '@tiptap/extension-table-header'
  import TableRow from '@tiptap/extension-table-row'
  import { Editor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
  import Icon from '@/UI/Icon'
  export default {
    components: {
      EditorContent,
      BubbleMenu,
      FloatingMenu,
      Icon,
    },

    props: {
      modelValue: {
        type: String,
        default: '<p></p>',
      },
      showVideo: {
        type: Boolean,
        default: false,
      },
    },

    emits: ['update:modelValue', 'createTable', 'createImage', 'createVideo'],

    data() {
      return {
        editor: null,
      }
    },

    watch: {
      modelValue(value) {
        const isSame = this.editor.getHTML() === value

        if (isSame) {
          return
        }

        this.editor.commands.setContent(value, false)
      },
    },

    methods: {
      setLink() {
        const previousUrl = this.editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
          return
        }

        // empty
        if (url === '') {
          this.editor.chain().focus().extendMarkRange('link').unsetLink().run()

          return
        }
        // update link
        this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
      },
      setTable() {
        this.editor.chain().focus().setHorizontalRule().run()
        this.$emit('createTable')
      },
      setImage() {
        this.editor.chain().focus().setHorizontalRule().run()
        this.$emit('createImage')
      },
      setVideo() {
        this.editor.chain().focus().setHorizontalRule().run()
        this.$emit('createVideo')
      },
    },

    mounted() {
      this.editor = new Editor({
        extensions: [
          StarterKit,
          Underline,
          Link.configure({
            openOnClick: false,
          }),
          Table.configure({
            resizable: true,
          }),
          TableRow,
          TableHeader,
          TableCell,
        ],
        content: this.modelValue,
        onUpdate: () => {
          this.$emit('update:modelValue', this.editor.getHTML())
        },
      })
    },

    beforeUnmount() {
      this.editor.destroy()
    },
  }
</script>

<style>
  .tippy-box {
    max-width: max-content !important;
  }
</style>
<style lang="scss" scoped>
  .editor {
    position: relative;
    // .editor__menu
    &__menu {
      border-radius: 8px;
      background: var(--color-gray-900, #2c2c2c);
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2), 0px 1px 2px 0px rgba(0, 0, 0, 0.15);
      padding: 5px 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    // .editor__button
    &__button {
      background-color: transparent;
      padding: 7px;
      color: var(--white);
      border-radius: 4px;
      &.is-active {
        color: #333333;
        background: #f5f5f5;
      }
    }
    // .editor__placeholder
    &__placeholder {
      font-size: 18px;
      font-weight: 400;
      line-height: 30px;
      color: var(--gray-5);
      user-select: none;
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    // .editor__content
    &__content {
      color: var(--text);
      :deep() {
        .tiptap.ProseMirror {
          min-height: 30px;
        }
        * + h2,
        * + h3,
        * + p,
        * + blockquote,
        * + ul,
        * + li {
          padding-top: 20px;
        }

        p {
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          line-height: 160%;
        }
        h2 {
          font-size: 28px;
          font-style: normal;
          font-weight: 700;
          line-height: 150%;
        }
        h3 {
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 150%;
        }
        blockquote {
          border-radius: 4px;
          background: #ffecec;
          padding: 30px;
          p {
            font-size: 18px;
            font-style: italic;
            font-family: $secondFont;
            font-weight: 400;
            line-height: 160%;
          }
        }
        ul {
          padding-left: 30px;
          li {
            list-style: disc;
          }
        }
        a {
          color: var(--accent);
          text-decoration: underline;
          cursor: pointer;
        }
        .tableWrapper {
          padding: 1rem 0;
          overflow-x: auto;
          table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            margin: 0;
            overflow: hidden;
            td,
            th {
              min-width: 1em;
              border: 1px solid #828282;

              padding: 3px 5px;
              vertical-align: top;
              box-sizing: border-box;
              position: relative;
              > * {
                margin-bottom: 0;
              }
            }
            th {
              text-align: left;
              font-size: 18px;
              font-weight: 500;
              line-height: 150%;
              background: #e5e5e5;
            }
          }
        }
      }
    }
  }
</style>
