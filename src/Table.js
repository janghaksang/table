import React from 'react';

function columnToLetter(column)
{
  let temp;
  let letter='';
  while(0 < column)
  {
    temp = (column-1)%26;
    letter = String.fromCharCode(temp+65)+letter;
    column = (column-temp-1)/26;
  }
  return letter;
}

function css(...args) {
  return args.map(arg=>{
    if(arg===null||arg===undefined||arg.length===0) {
      return null;
    } else if(typeof arg==='string') {
      return arg;
    } else if(typeof arg==='object') {
      return Object.keys(arg).map(key=>{
        return arg[key]?key:null;
      });
    } else {
      return null;
    }
  }).flat().filter(arg=>arg!==null).join(' ');
}

export default class Table extends React.Component {
  makeProps(events,columnIndex,schema,props) {
    let es = {}
    Object.keys(events).forEach(key=>{
      es[key] = events[key](columnIndex,schema,props);
    })
    return es;
  }

  renderHeaderColumnCellSortButton = (columnIndex,schema,props)=>{
    if(props.renderHeaderColumnCellSortButton) return props.renderHeaderColumnCellSortButton(columnIndex,schema,props);
    let {name,sort} = schema||{};
    let {use,className,style,...events} = sort||{};
    name = name||columnToLetter(columnIndex+1);
    style = style||{};
    return (
      <button
        className={css('Sort',{'disabled':!use},className)}
        style={style}
        {...this.makeProps(events,columnIndex,schema,props)}
        >
        {name}
      </button>
    );
  }

  renderHeaderColumnCellFilterButton = (columnIndex,schema,props)=>{
    if(props.renderHeaderColumnCellFilterButton) return props.renderHeaderColumnCellFilterButton(columnIndex,schema,props);
    let {filter} = schema||{};
    let {use,className,style,element,...events} = filter||{};
    if(!use) return null;
    style = style||{};
    return (
      <button
        className={css('Filter',className)}
        style={style}
        {...this.makeProps(events,columnIndex,schema,props)}
        >
        {'⑂'}
      </button>
    );
  }

  renderHeaderColumnCell = (columnIndex,schema,props)=>{
    if(props.renderHeaderColumnCell) return props.renderHeaderColumnCell(columnIndex,schema,props);
    let {className,style} = schema||{};
    style = style||{};
    return (
      <th
        key={columnIndex+1}
        className={css('Cell','HeaderCell','HeaderColumnCell',className)}
        style={style}
        >
        <div>
          {this.renderHeaderColumnCellSortButton(columnIndex,schema,props)}
          {this.renderHeaderColumnCellFilterButton(columnIndex,schema,props)}
        </div>
      </th>
    );
  }

  renderHeaderRowCell = (rowIndex,schema,props)=>{
    if(props.renderHeaderRowCell) return props.renderHeaderRowCell(rowIndex,schema,props);
    let {name,className,style} = schema||{};
    name = name||rowIndex+1;
    style = style||{};
    return (
      <th
        className={css('Cell','HeaderCell','HeaderRowCell',className)}
        style={style}
        >
        {name}
      </th>
    );
  }

  renderCell = (rowIndex,columnIndex,cellData,rowData,columnId,schema,props)=>{
    if(props.renderCell) return props.renderCell(rowIndex,columnIndex,cellData,rowData,columnId,schema,props);
    return (
      <td
        key={columnId}
        className={css('Cell')}
        >
        {cellData}
      </td>
    );
  }

  renderHeaderBlock = (props)=>{
    if(props.renderHeaderBlock) return props.renderHeaderBlock(props);
    return (<th className={css('Cell','HeaderCell')}/>);
  }

  renderHeaderRow = (props)=>{
    if(props.renderHeaderRow) return props.renderHeaderRow(props);
    let {tableSchema:{rowHeaderVisible},rowSchema,columnSchema} = props;
    let {className,style} = rowSchema[0]||{};
    return (
      <tr
        className={css('Row','HeaderRow',className)}
        style={style}
        >
        {rowHeaderVisible&&this.renderHeaderBlock(props)}
        {columnSchema&&columnSchema.length&&columnSchema.map((schema,index)=>this.renderHeaderColumnCell(index,schema,props))}
      </tr>
    );
  }

  renderRow = (rowIndex,rowData,props)=>{
    if(props.renderRow) return props.renderRow(rowIndex,rowData,props);
    let {tableSchema:{rowHeaderVisible},rowSchema,columnSchema} = props;
    let {className,style} = rowSchema[rowIndex+1]||{};
    return (
      <tr
        key={rowIndex}
        className={css('Row',className)}
        style={style}
        >
        {rowHeaderVisible&&this.renderHeaderRowCell(rowIndex,rowSchema[rowIndex+1],props)}
        {columnSchema&&columnSchema.length&&columnSchema.map((schema,columnIndex)=>this.renderCell(rowIndex,columnIndex,rowData[schema.id],rowData,schema.id,columnSchema,props))}
      </tr>
    )
  }

  renderHeader(props) {
    if(props.renderHeader) return props.renderHeader(props);
    let {tableSchema:{columnHeaderVisible}} = props;
    return columnHeaderVisible&&(
      <thead>
        {this.renderHeaderRow(props)}
      </thead>
    );
  }

  renderBody(props) {
    if(props.renderBody) return props.renderBody(props);
    let {data} = props;
    if(!data) return null;
    return (
      <tbody>
        {data.map((rowData,rowIndex)=>this.renderRow(rowIndex,rowData,props))}
      </tbody>
    );
  }

  render() {
    let {className,style,...props} = this.props;
    return (
      <table
        className={css('Table',className)}
        style={{
          ...style,
        }}
        >
        {this.renderHeader(props)}
        {this.renderBody(props)}
      </table>
    );
  }
}
