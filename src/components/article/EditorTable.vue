<template>
  <div class="editor-table">
    <div class="editor-table__controllers">
      <button @click="editor.chain().focus().addColumnAfter().run()" class="editor-table__controller _add">
        <icon name="editorTableInsertColumn" />
      </button>
      <button @click="editor.chain().focus().addRowAfter().run()" class="editor-table__controller _t-90 _add">
        <icon name="editorTableInsertColumn" />
      </button>
      <button @click="editor.chain().focus().deleteColumn().run()" class="editor-table__controller _remove">
        <icon name="editorTableRemoveColumn" />
      </button>
      <button @click="editor.chain().focus().deleteRow().run()" class="editor-table__controller _t-90 _remove">
        <icon name="editorTableRemoveColumn" />
      </button>
      <button @click="editor.chain().focus().mergeOrSplit().run()" class="editor-table__controller _join">
        <icon name="editorTableJoinColum" />
      </button>
      <button @click="editor.chain().focus().toggleHeaderCell().run()" class="editor-table__controller _head">
        <icon name="editorTableHeader" />
      </button>
      <button @click="deleteTable" class="editor-table__controller _delete">
        <icon name="editorTableRemoveTable" />
      </button>
    </div>

    <div class="editor-table__content">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
  import Document from '@tiptap/extension-document'
  import Gapcursor from '@tiptap/extension-gapcursor'
  import Paragraph from '@tiptap/extension-paragraph'
  import Table from '@tiptap/extension-table'
  import TableCell from '@tiptap/extension-table-cell'
  import TableHeader from '@tiptap/extension-table-header'
  import TableRow from '@tiptap/extension-table-row'
  import Text from '@tiptap/extension-text'

  import { Editor, EditorContent } from '@tiptap/vue-3'

  import Icon from '@/UI/Icon'

  export default {
    components: {
      EditorContent,
      Icon
    },
    props: {
      modelValue: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue', 'delete'],
    data() {
      return {
        editor: null
      }
    },
    watch: {
      modelValue(value) {
        const isSame = this.editor.getHTML() === value

        if (isSame) {
          return
        }

        this.editor.commands.setContent(value, false)
      }
    },
    methods: {
      deleteTable() {
        this.$emit('delete')
      }
    },
    mounted() {
      this.editor = new Editor({
        extensions: [
          Document,
          Paragraph,
          Text,
          Gapcursor,
          Table.configure({
            resizable: false
          }),
          TableRow,
          TableHeader,
          TableCell
        ],
        content: this.modelValue,
        onUpdate: () => {
          this.$emit('update:modelValue', this.editor.getHTML())
        }
      })
    },

    beforeUnmount() {
      this.editor.destroy()
    }
  }
</script>

<style lang="scss" scoped>
  .editor-table {
    padding: 20px 0;
    // .editor-table__controllers
    &__controllers {
      display: flex;
      border-radius: 4px;
      background: #f1f1f1;
      padding: 4px;
      width: fit-content;
      gap: 2px;
    }
    // .editor-table__controller
    &__controller {
      border-radius: 4px;
      padding: 7px;
      color: #333333;
      &._t-90 {
        transform: rotate(90deg);
      }
      &._add {
        background-color: #deecfd;
      }
      &._remove {
        background-color: #ffcfcf;
      }
      &._join {
        background-color: #b1d694;
      }
      &._head {
        background-color: #d0d0d0;
      }
      &._delete {
        background-color: #ff7979;
      }
    }
    // .editor-table__content
    &__content {
      margin-top: 10px;
      &:deep() {
        table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
          width: 100%;

          td,
          th {
            vertical-align: top;
            box-sizing: border-box;
            border: 1px solid #828282;
            position: relative;
            padding: 6px 10px;
            > * {
              margin-bottom: 0;
            }
          }

          th {
            font-weight: bold;
            text-align: left;
            background-color: #e5e5e5;
          }

          .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: '';
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: #d6ecff;
            pointer-events: none;
          }
          p {
            margin: 0;
            color: #000;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
          }
        }
      }
      .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
      }
    }
  }
</style>
