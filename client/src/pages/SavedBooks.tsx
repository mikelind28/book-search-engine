// TODO: Remove the useEffect() hook that sets the state for UserData.
// Instead, use the useQuery() hook to execute the GET_ME query on load and save it to a variable named userData.
// Use the useMutation() hook to execute the REMOVE_BOOK mutation in the handleDeleteBook() function instead of the deleteBook() function that's imported from the API file. (Make sure you keep the removeBookId() function in place!) 

import { useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { Book } from '../models/Book';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
// import { User } from '../models/User';

const SavedBooks = () => {
  // const [userData, setUserData] = useState<User>({
  //   username: '',
  //   email: '',
  //   password: '',
  //   savedBooks: [],
  //   bookCount: 0
  // });

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  const { loading, data } = useQuery(GET_ME);


  console.log("Data!", data);

  // useEffect(() => {
  //   if (!loading && data?.me) {
  //     console.log('Setting data! Finally!!');
  //     userData = data.me;
  //   }
  // }, [data]);

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const [removeBook] = useMutation(REMOVE_BOOK, {
      refetchQueries: [
        GET_ME,
        'me'
      ]
    });

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {data.me.username ? (
            <h1>Viewing {data.me.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data.me.bookCount
            ? `Viewing ${data.me.savedBooks.length} saved ${
                data.me.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {data.me.savedBooks.map((book: Book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
