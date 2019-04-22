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
  renderHeaderColumnCellSortButton = (columnIndex,schema,props)=>{
    let {name,sort} = schema||{};
    let {use,className,style,...events} = sort||{};
    name = name||columnToLetter(columnIndex+1);
    style = {};
    return (
      <button
        className={css('Sort',{'disabled':!use},className)}
        style={style}
        {...Object.keys(events).map(key=>({
          [key]:events[key](columnIndex,schema,props)
        }))}
        >
        {name}
      </button>
    );
  }

  renderHeaderColumnCellFilterButton = (columnIndex,schema,props)=>{
    let {filter} = schema||{};
    let {use,className,style,element,...events} = filter||{};
    if(!use) return null;
    style = {};
    return (
      <button
        className={css('Filter',className)}
        style={style}
        {...Object.keys(events).map(key=>({
          [key]:events[key](columnIndex,schema,props)
        }))}
        >
        {'⑂'}
      </button>
    );
  }

  renderHeaderColumnCell = (columnIndex,schema,props)=>{
    let {className,style} = schema||{};
    let renderHeaderColumnCellSortButton = props.renderHeaderColumnCellSortButton || this.renderHeaderColumnCellSortButton;
    let renderHeaderColumnCellFilterButton = props.renderHeaderColumnCellFilterButton || this.renderHeaderColumnCellFilterButton;
    style = style||{};
    return (
      <th
        key={columnIndex+1}
        className={css('HeaderCell HeaderColumnCell',className)}
        style={style}
        >
        <div>
          {renderHeaderColumnCellSortButton(columnIndex,schema,props)}
          {renderHeaderColumnCellFilterButton(columnIndex,schema,props)}
        </div>
      </th>
    );
  }

  renderHeaderRowCell = (rowIndex,schema,props)=>{
    let {name,className,style} = schema||{};
    name = name||rowIndex+1;
    style = style||{};
    return (
      <th
        className={css('HeaderCell HeaderRowCell',className)}
        style={style}
        >
        {name}
      </th>
    );
  }

  renderCell = (rowIndex,columnIndex,cellData,rowData,columnId,schema,props)=>{
    return (
      <td
        key={columnId}
        className={'Cell'}
        >
        {cellData}
      </td>
    );
  }

  renderHeaderBlock = (props)=>{
    return (<th className={css('HeaderCell')}/>);
  }

  renderHeaderRow = (props)=>{
    let {tableSchema:{rowHeaderVisible},rowSchema:{className,style},columnSchema} = props;
    let renderHeaderBlock = props.renderHeaderBlock||this.renderHeaderBlock;
    let renderHeaderColumnCell = props.renderHeaderColumnCell||this.renderHeaderColumnCell;
    return (
      <tr
        className={css('HeaderRow',className)}
        style={style}
        >
        {rowHeaderVisible&&renderHeaderBlock(props)}
        {columnSchema&&columnSchema.length&&columnSchema.map((schema,index)=>renderHeaderColumnCell(index,schema,props))}
      </tr>
    );
  }

  renderRow = (rowIndex,rowData,props)=>{
    let {tableSchema:{rowHeaderVisible},rowSchema,columnSchema} = props;
    let {className,style} = rowSchema;
    let renderHeaderRowCell = props.renderHeaderRowCell||this.renderHeaderRowCell;
    let renderCell = props.renderCell||this.renderCell;
    return (
      <tr
        key={rowIndex}
        className={css('Row',className)}
        style={style}
        >
        {rowHeaderVisible&&renderHeaderRowCell(rowIndex,rowSchema[rowIndex+1],props)}
        {columnSchema&&columnSchema.length&&columnSchema.map((schema,columnIndex)=>renderCell(rowIndex,columnIndex,rowData[schema.id],rowData,schema.id,columnSchema,props))}
      </tr>
    )
  }

  renderHeader(props) {
    let {tableSchema:{columnHeaderVisible}} = props;
    let renderHeaderRow = props.renderHeaderRow||this.renderHeaderRow;
    return columnHeaderVisible&&(
      <thead>
        {renderHeaderRow(props)}
      </thead>
    );
  }

  renderBody(props) {
    let {data} = props;
    let renderRow = props.renderRow||this.renderRow;
    return data&&renderRow&&data.map((rowData,rowIndex)=>renderRow(rowIndex,rowData,props));
  }

  render() {
    let {className,style} = this.props;
    return (
      <table
        className={css('Table',className)}
        style={{
          ...style,
        }}
        >
        {this.renderHeader(this.props)}
        <tbody>
          {this.renderBody(this.props)}
        </tbody>
      </table>
    );
  }
}
