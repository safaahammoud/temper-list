import axios from 'axios';

const baseUrl = 'https://jsonplaceholder.typicode.com';

export const getPosts = async () => {
  const { data } = await axios.get(`${baseUrl}/posts`);

  return data;
};
