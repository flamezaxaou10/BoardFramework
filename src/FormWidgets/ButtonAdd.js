import React from 'react'
import './ButtonAdd.css'
import CreateBoard from './CreateBoard'
import Store from '../store/Store'
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
class ButtonAdd extends React.Component {
  handleClick = () => {
    Store.editWidget = false
  }
  render() {

    return (
      <div className={(Store.currentId)?'ButtonAdd':'ButtonAdd d-none'}>
        <Tooltip placement="left" trigger={['hover']} overlay={'Add Widget'}>
          <div className="circleMenu btn p-0 rounded-circle" 
          data-toggle="modal" 
          data-target=".ModalCreate"
          onClick={this.handleClick}>+</div>
        </Tooltip>

        <CreateBoard/>
        {/* {(this.state.showModal)?<CreateBoard showModal={this.handleClick}/>:''} */}
      </div>
    )
  }
}


export default ButtonAdd