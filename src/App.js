import React, { Component } from 'react';
import './App.css';

import Table from './Table'

class App extends Component {
  render() {
    return (
      <div className={'App'}>
        <Table
          style={{
            width:'100%',
          }}
          tableSchema={{
            rowHeaderVisible:false,
            columnHeaderVisible:true,
          }}
          rowSchema={{
            1:{name:'alpha',style:{width:65}},
            3:{name:'gamma'},
          }}
          columnSchema={[
            {id:'col1',name:'id',type:'string',sort:{use:true},filter:{use:true},mandatory:true,editable:true,className:null,style:{width:200},options:{limit:50}},
            {id:'col2',name:'offendit',type:'text',sort:{use:true},filter:{use:true},mandatory:true,editable:true,className:null,style:{},options:{}},
            {id:'col3',name:'co',type:'number',sort:{use:true},filter:{use:true},mandatory:true,editable:true,className:null,style:{},options:{}},
          ]}
          data={[
            {col1: 'foo', col2: 0, col3: 'a'},
            {col1: 'bar', col2: 1, col3: 'b'},
            {col1: 'baz', col2: 2, col3: 'c'}
          ]}
          />
      </div>
    );
  }
}

export default App;
