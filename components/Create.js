import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import QUERRY from '../query/query'



class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      author: "",
      comment: "",
    };
  }

  render() {
    return (
        <Mutation
          mutation={QUERRY.ADD_POST}
          update={(proxy, { data }) => {
            //const { events } = cache.readQuery({ query: READ_LIST });
            console.log(proxy);

            // cache.writeQuery({
            //   query: READ_LIST,
            //   data: { events: events.concat([data.events]) }
            // });
          }}
        >
          {(addPost, { data, loading, error }) => {
            if (loading) return <p>loading...</p>;
            if (error) return <p>error...</p>;

            return (
              <div>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    const { author, comment } = this.state;
                    await addPost({
                      variables: {
                        author, comment,
                      },
                    });
                    this.setState({ author: "", comment: "" });
                  }}
                >
                  <h1> CreatePost </h1>
                  <input
                    onChange={e =>
                      this.setState({ author: e.target.value })
                    }
                    placeholder="author"
                    type="text"
                    value={this.state.author}
                  />
                  <input
                    onChange={e =>
                      this.setState({ comment: e.target.value })
                    }
                    placeholder="comment"
                    type="text"
                    value={this.state.comment}
                  />
                  <input
                    disabled={
                      !this.state.author || !this.state.comment
                    }
                    type="submit"
                    value="Create"
                  />
                </form>
              </div>
            );
          }}
        </Mutation>
      );
    }
  }

  export default Create;
