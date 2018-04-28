<template>
  <div>
    <label>Table creator</label>

    <table>
      <!-- TABLE HEAD NECESSARY -->
      <tr>
        <td v-for="(col, colIndex) in cols"
            :key="colIndex"
        >
          <q-btn color="grey-2"
                 icon="reorder"
          />
        </td>
      </tr>

      <!-- TABLE BODY -->
      <tr v-for="(row, rowIndex) in rows"
          :key="rowIndex"
      >
        <td v-for="(col, colIndex) in cols"
            :key="colIndex"
        >
          <q-btn color="grey-5"
                 @click="selectTable(rowIndex + 1, colIndex + 1)"
                 icon="check"
          />
        </td>
        <td>
          <q-btn color="primary"
                 @click="cols = new Array(cols.length + 1)"
                 icon="add"
          />
        </td>
      </tr>

      <!-- ADD ROW -->
      <tr>
        <td v-for="(col, colIndex) in cols"
            :key="colIndex"
        >
          <q-btn color="primary"
                 @click="rows = new Array(rows.length + 1)"
                 icon="add"
          />
        </td>
      </tr>
    </table>

    <br>

    <div style="text-align: right;">
      <q-btn color="primary"
             label="Close"
             @click="closeModal()"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rows: new Array(5),
      cols: new Array(5)
    }
  },

  methods: {
    closeModal () {
      this.$emit('closemodal')
    },

    selectTable (x, y) {
      let rowsAr = new Array(x)
      let colsAr = new Array(Number(y))

      let table = []

      let head = ['']
      for (let col of colsAr) {
        col = col + ''
        head.push(' Data ')
      }
      head.push('')
      table.push(head.join('|'))

      let headUnderline = ['']
      for (let col of colsAr) {
        col = col + ''
        headUnderline.push(' ---- ')
      }
      headUnderline.push('')
      table.push(headUnderline.join('|'))

      for (let row of rowsAr) {
        row = row + ''
        let newRow = ['']
        for (let col of colsAr) {
          col = col + ''
          newRow.push('      ')
        }
        newRow.push('')
        table.push(newRow.join('|'))
      }

      table = table.join('\n')

      this.$emit('tablecreate', table)
      this.closeModal()
    }
  }
}
</script>

<style>
</style>
