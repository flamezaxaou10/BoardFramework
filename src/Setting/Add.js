import React, { Component } from 'react'
import './Add.css'
class Add extends Component {
    componentDidMount() {

        //Funkcja
        /* circle.addEventListener('click' , function(){
          console.log('Menu');
          circle.classList.toggle('circleAnimate');
          menu.classList.toggle('menuKoniec');
        }) */
    }
  render() {
    return (
        <div>
            <div className="circleMenu"  data-toggle="modal" data-target="#exampleModal">+</div>
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
                
        </div>
    )
  }
}

export default Add
