import './App.css';
import Content from './Content'
import Searchbar from './Searchbar';
import { useState } from 'react';
import { Progress, Heading, Box } from '@chakra-ui/react';


function App() {
  const [celeb, setCeleb] = useState()
  const [loading, setLoading] = useState(false)

  return (
    <Box className='page-container' backgroundColor={"#7EBC89"} paddingBottom={"12vh"}>
      {loading && <Progress size='sm' isIndeterminate />}
      <Heading textAlign={'center'} paddingTop={10} onClick={()=>{setCeleb("")}} cursor={"pointer"}>MOVIE PERSON RATER</Heading>
      <div className="App">

        <Searchbar setCeleb={setCeleb} setLoading={setLoading} />

        {celeb && <Content celeb={celeb} loading={loading} setLoading={setLoading} />}
      </div>

    </Box>
  );
}

export default App;
