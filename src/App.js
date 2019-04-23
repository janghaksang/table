import React,{ Component } from 'react';
import uuidv4 from 'uuid/v4';

import Table from './Table'

import './App.css';

class App extends Component {
  constructor(props,context) {
    super(props,context);
    this.state = this.initialState();
  }

  initialState() {
    return {
      tableSchema:{
        rowHeaderVisible:true,
        columnHeaderVisible:true,
      },
      rowSchema:{
        0:{style:{color:'#a0a0a0'}},
        1:{style:{color:'red'}},
      },
      columnSchema:[
        {id:'col1',name:'id',type:'string',sort:{use:true,onClick:this.onSort},filter:{use:true,onClick:this.onFilter},className:null,style:{width:200},options:{mandatory:true,editable:true,limit:50}},
        {id:'col2',name:'offendit',type:'number',sort:{use:true,onClick:this.onSort},filter:{use:true,onClick:this.onFilter},className:null,style:{},options:{mandatory:true,editable:true}},
        {id:'col3',name:'co',type:'string',sort:{use:true,onClick:this.onSort},filter:{use:true,onClick:this.onFilter},className:null,style:{},options:{mandatory:true,editable:true}},
      ],
      data:[
        {_row_id:`App-0-${uuidv4()}`,col1:'foo',col2:0,col3:'a'},
        {_row_id:`App-1-${uuidv4()}`,col1:'bar',col2:1,col3:'b'},
        {_row_id:`App-2-${uuidv4()}`,col1:'baz',col2:2,col3:'c'}
      ],
      sorting:{},
      filtering:[],
    };
  }

  filterFeatures(type) {
    switch(type) {
      case 'string': return ['==','!=','in','!in'];
      case 'number': return ['==','!=','>','<','>=','<='];
      default: return ['=='];
    }
  }

  renderFilterFeature(feature,index) {
    return (
      <option key={index} value={feature}>{feature}</option>
    )
  }

  renderFilterValue(filter,index) {
    let value = filter.value||(()=>{
      switch(filter.type) {
        case 'string': return '';
        case 'number': return '';
        default: return '';
      }
    })();
    return (
      <input
        type={(()=>{
          switch(filter.type) {
            case 'string': return 'text';
            case 'number': return 'number';
            default: return 'text';
          }
        })()}
        value={value}
        style={{
          width:filter.scrollWidth
        }}
        onChange={this.onChangeFilterValue(index)}
        />
    );
  }

  renderFiltering() {
    let {filtering} = this.state;
    return (
      <div className={'Filtering'}>
        {filtering.map((filter,index)=>{
          let filterFeatures = this.filterFeatures(filter.type);
          return (
            <div
              key={filter.type+index}
              className={'FilteringItem'}
              >
              <span>{filter.name}</span>
              <select value={filter.feature} onChange={this.onChangeFilterFeature(index)}>
                {filterFeatures.map((feature,i)=>this.renderFilterFeature(feature,i))}
              </select>
              {this.renderFilterValue(filter,index)}
              <button onClick={this.onRemoveFilterigItem(index)}>{'✕'}</button>
            </div>
          )
        })}
      </div>
    )
  }

  filterData(data) {
    let {filtering} = this.state;
    filtering.forEach((filter,index)=>{
      if(filter.value==null) return;
      data = data.filter((row,index)=>{
        switch(filter.feature) {
          case '==': return row[filter.id]===filter.value;
          case '!=': return row[filter.id]!==filter.value;
          case 'in': return 0 <= row[filter.id].indexOf(filter.value);
          case '!in': return !(0 <= row[filter.id].indexOf(filter.value));
          case '>': return row[filter.id] > filter.value;
          case '<': return row[filter.id] < filter.value;
          case '>=': return row[filter.id] >= filter.value;
          case '<=': return row[filter.id] <= filter.value;
          default: return false;
        }
      });
    })
    return data;
  }

  render() {
    let {tableSchema,rowSchema,columnSchema,data} = this.state;
    return (
      <div className={'App'}>
        {this.renderFiltering()}
        <Table
          style={{
            width:'100%',
          }}
          tableSchema={tableSchema}
          rowSchema={rowSchema}
          columnSchema={columnSchema}
          data={this.filterData(data)}
          />
      </div>
    );
  }

  sortRows = (id,order)=> (a,b)=>{
    if(a[id]==null&&b[id]==null) return 0;
    if(a[id]==null) return order*-1;
    if(b[id]==null) return order*1;
    if(a[id]===b[id]) return 0;
    return order*(a[id] < b[id]?-1:1);
  }

  onSort = (columnIndex,schema,props)=> (e)=>{
    let {id} = schema;
    this.setState(({data,sorting})=>{
      if(id in sorting) {
        sorting = {
          ...sorting,
          [id]:sorting[id]*-1
        };
      } else {
        sorting = {
          ...sorting,
          [id]:-1
        };
      }
      data.sort(this.sortRows(id,sorting[id]));
      return {data,sorting};
    });
  }

  onFilter = (columnIndex,schema,props)=> (e)=>{
    let {id,name,type} = schema;
    this.setState(({filtering})=>{
      filtering = filtering.slice(0);
      filtering.push({id,name,type,feature:'==',value:null,scrollWidth:50})
      return {filtering};
    })
  }

  onRemoveFilterigItem = (index)=> (e)=>{
    this.setState(({filtering})=>{
      filtering.splice(index,1);
      return {filtering};
    })
  }

  onChangeFilterFeature = (theIndex)=>(e)=>{
    let feature = e.target.value;
    this.setState(({filtering})=>{
      let theItem = filtering[theIndex];
      theItem = {
        ...theItem,
        feature,
      };
      filtering = filtering.map((item,index)=>index===theIndex?theItem:item);
      return {filtering};
    })
  }

  castValue(type,value) {
    switch(type) {
      case 'string': return value.toString();
      case 'number': return parseInt(value,10);
    }
  }

  onChangeFilterValue = (theIndex)=>(e)=>{
    let {value,scrollWidth} = e.target;
    this.setState(({filtering})=>{
      let theItem = filtering[theIndex];
      theItem = {
        ...theItem,
        value:this.castValue(theItem.type,value),
        scrollWidth
      };
      filtering = filtering.map((item,index)=>index===theIndex?theItem:item);
      return {filtering};
    })
  }
}

export default App;
