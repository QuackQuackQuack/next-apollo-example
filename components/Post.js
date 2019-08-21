import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import DeleteButton from '../components/DeleteButton'
import QUERRY from '../query/query'

const Post = () => (
  <Query query={QUERRY.GET_POSTS}>
    {({ data, loading, subscribeToMore }) => {
      if (!data) {
        return null;
      }

      if (loading) {
        return <span>Loading ...</span>;
      }

      return (
        <Posts
          posts={data.posts}
          subscribeToMore={subscribeToMore}
        />
      );
    }}
  </Query>
);

class Posts extends React.Component {

  componentDidMount() {
    this.props.subscribeToMore({
      document: QUERRY.POST_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;

        return {
          posts: [
            ...prev.posts,
            subscriptionData.data.postAdded,
          ],
        };
      },
    });
    this.props.subscribeToMore({
      document: QUERRY.POST_EDIT,
      updateQuery: (prev, { subscriptionData }) => {
          console.log('edit', subscriptionData);
          if (!subscriptionData.data) return prev;

      }
    });
    this.props.subscribeToMore({
      document: QUERRY.POST_DELETE,
      updateQuery: (prev, { subscriptionData }) => {
          console.log('delete', subscriptionData);
          if (!subscriptionData.data) return prev;


          const result = prev.posts.filter(obj => {
            return obj._id !== subscriptionData.data.postDeleted._id;
          });

          return {
            posts: [
              ...result,
            ]
          }

      }
    });
  }

  render() {
    return (
      <div>
        <ul>
          {
            this.props.posts.map((post, index) => (
              <li key={index}>{index} {post.author} {post.comment}<DeleteButton post={ post }/></li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default Post;


//