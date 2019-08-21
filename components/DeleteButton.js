import { Mutation } from 'react-apollo'
import React, { Component } from 'react';
import QUERRY from '../query/query'


class DeleteButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: '',
    };
  }

  render() {
    return (
      <Mutation
        mutation={ QUERRY.DELETE_POST }>
        {(deletePost, { data, loading, called, error }) => {
          return (
            <button onClick={(e)=>{
              const _id = this.props.post._id;

              e.preventDefault();
              deletePost({
                variables: {
                  _id,
                }
              })
            }}>삭제</button>
          )
        }}
      </Mutation>
      );
    }
  }

  export default DeleteButton;