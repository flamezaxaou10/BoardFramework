import { observable } from 'mobx'
import axios from 'axios'
import React from 'react'
import ListDatasource from './ListDatasource'
import Store from './Store'
//import NETPIEMicrogear from './Microgear'
class DatasourceStore {
  @observable datasources = null

  createDatasource (payload) {
    axios.post(Store.server + '/datasource/', {
      datasource: payload,
      userId: Store.user.id
    }).then((res) => 
      console.log(res)
    )
  }

  updateDatasource (datasourceId, payload) {
    axios.put(Store.server + '/datasource/' + datasourceId, {datasource : payload}).then((res) => 
      console.log(res)
    )
  }

  deleteDatasource (datasourceId) {
    axios.delete(Store.server + '/datasource/' + datasourceId).then((res) => 
      console.log(res)
    )
  }

  listsDatasources () {
    if (this.datasources)
    return this.datasources.map((datasource) => 
      <ListDatasource key={datasource._id} datasource={datasource}/>
    )
    return null
  }
}

export default new DatasourceStore()