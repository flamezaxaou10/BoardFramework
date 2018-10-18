import React, { Component } from 'react'
import './Pages.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Store from '../store/Store'
import LocalStore from '../store/LocalStore'
import socketIOClient from 'socket.io-client'
import ClickOutside from 'react-click-outside';

const socket = socketIOClient(Store.server)

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addPage: false,
      pages: [],
      inputName: '',
      editPage: null,
      selectPage: 0,
      connect: true
    }
  }
  componentWillMount () {
  }
  componentDidMount() {
    if (this.state.connect) this.response()
    else this.loadLocal()
  }
  loadLocal = () => {
    this.setState({
      pages: LocalStore.local.pages
    })
  }
  response = () => {
    this.getBoard()
    socket.on('update-board', (msg) => {
      console.log('update-board', msg)
      this.getBoard()
    })
  }

  getBoard = () => {
    let pages = []
    axios.get(Store.server + '/board/').then((res) => {
      res.data.map((board) =>
        pages.push({
          id: board._id,
          name: board.boardName,
          colorName: board.colorName
        })
      )
      this.setState({
        pages: pages
      })
    })
  }

  handleClick = (e) => {
    e.preventDefault();
    this.props.callback(!this.props.mode);
  }

  handleClickAdditem = (e) => {
    e.preventDefault();
    this.setState({
      addPage: true
    })
  }

  savePage = (index, pageId) => {
    let tem = this.state.pages
    if (this.state.inputName !== '') {
      let payload = {
        boardName: this.state.inputName,
        colorName: 'native'
      }
      if (index === -1) {
        axios.post( Store.server + '/board/', payload ).then((res) => {
          console.log(res)
        })
        LocalStore.insertPage(this.state.inputName)
      }
      else {
        axios.put( Store.server + '/board/' + pageId, payload).then((res) => {
          console.log(res)
        })
        LocalStore.updatePage(index,pageId,this.state.inputName)
      }
    }
    this.setState({
      pages: tem,
      addPage: false,
      inputName: '',
      editPage: null,
    })
  }

  handleChange(e) {
    this.setState({ inputName: e.target.value });
  }
  handleCancel = () => {
    this.setState({
      addPage: false,
      inputName: '',
      editPage: null,
    })
  }
  handleKeyPress = (objKeypress, e) => {
    if (e.key === 'Enter') {
      let index = objKeypress.index
      let pageId = objKeypress.pageId
      this.savePage(index, pageId)
    }
  }

  clickEdit = (index) => {
    this.setState({
      editPage: index,
      inputName: this.state.pages[index].name
    })
  }

  deletePage = (pageId) => {
    axios.delete( Store.server + '/board/' + pageId).then((res) => {
      console.log(res)
    })
    LocalStore.deletePage(pageId)
  }

  handleClickpage = (pageId, pageName, colorName) => {
    this.setState({
      selectPage: pageId
    },() => {
      Store.currentId = pageId
      Store.pageName = pageName
      Store.setColor(colorName)
    })
  }

  render () {
    let listPage = []
    const {pages, editPage} = this.state
    let lspage

    let addPage = <a onClick={this.handleClickAdditem} className="second"><i className="fas fa-plus-square"></i> new page</a>
    if (this.state.addPage) {
      let objKeypress = {
        index: -1,
        pageId: 0
      }
      addPage =
      <ClickOutside onClickOutside={this.handleClose}>
        <div className="input-group addpage">
          <input type="text" className="form-control addpage border-0 rounded-0 " 
            onBlur={() => this.savePage(-1)} 
            onKeyPress={this.handleKeyPress.bind(this, objKeypress)} 
            placeholder="new page" aria-label="new page" 
            onChange={this.handleChange.bind(this)} 
            aria-describedby="button-addon2" />
          <div className="input-group-append">
            <button className="btn rounded-0 editbtn bg-transparent" type="button" id="button-addon2" onClick={() => this.savePage(-1)}>
              <i className="fas fa-save"></i>
            </button>
          </div>
        </div>
      </ClickOutside>
    }
    listPage = pages.map((page, index) => {
      let objKeypress = {
        index: index,
        pageId: page.id
      }
      if (editPage !== index) {
        lspage =
          <Link to={'/board/' + page.id} onClick={() => this.handleClickpage(page.id, page.name, page.colorName)} key={page.id} className={(this.state.selectPage === page.id) ? 'active' : ''}>
            <li>
              <div className="row">
                <div className="col-10 col-sm-10 text-truncate">
                  {page.name}
                </div>
                <div className="col-2 col-sm-2 editmenu px-0">
                  <i className="fas fa-pen-square editbtn mr-1" onClick={() => this.clickEdit(index)}></i>
                  <i className="fas fa-minus-square editbtn del" onClick={() => this.deletePage(page.id)}></i>
                </div>
              </div>
          </li>
          </Link>
      } else {
        lspage =
        <ClickOutside onClickOutside={this.handleClose}>
          <div className="input-group addpage" key={index}>
            <input type="text" className="form-control addpage border-0 rounded-0 " 
              value={this.state.inputName} 
              onBlur={() => this.savePage(index, page.id)} 
              onKeyPress={this.handleKeyPress.bind(this, objKeypress)} 
              placeholder="new page" aria-label="new page" 
              onChange={this.handleChange.bind(this)} 
              aria-describedby="button-addon2" 
              autoFocus />
            <div className="input-group-append">
            </div>
          </div>
        </ClickOutside>
      }
      return lspage
    })
    return (
      <ul className="list-unstyled components">
        <li>
          <a href="#pageSubmenu" data-toggle="collapse" aria-haspopup="true" aria-expanded="true">Pages</a>
          <ul className="collapse list-unstyled show" id="pageSubmenu">
            <Link to={'/react/'} onClick={() => Store.currentId = 0}>
              <li>
                <div className="row">
                  <div className="col-10 col-sm-10 text-truncate">
                    React Grid Lyout
                  </div>
                  <div className="col-2 col-sm-2 editmenu px-0">
                    <i className="fas fa-pen-square editbtn mr-1" ></i>
                    <i className="fas fa-minus-square editbtn del"></i>
                  </div>
                </div>
            </li>
            </Link>
            {listPage}
            <li>{addPage}</li>
          </ul>
        </li>
      </ul>
    )
  }
}

export default Page
