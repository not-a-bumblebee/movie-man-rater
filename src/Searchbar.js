import { Input, Image, Flex, Box } from "@chakra-ui/react"
import { useRef, useState } from "react"

export default function Searchbar({setCeleb,setLoading }) {
    const [results, setResults] = useState()
    const [query, setQuery] = useState("")

    let searchRef = useRef(null)
    let inputRef = useRef(null)

    console.log("Searchbar rendered");
    console.log("Searchbar results:", results);

    const handleInput = async (e) => {
        console.log("Searchbar input:",e.target.value);
        
        if (e.target.value !== "") {
            let z = await (await fetch('https://movie-man-rater-api.onrender.com/search/' + e.target.value)).json()
            console.log("fetched data:",z);
            let pastName = ""
            let jsx = []

            z.results.map(x => {
                if ( (pastName !== x.name) && (x.profile_path !== null) ) {
                    pastName = x.name;
                    let imgSrc= "https://image.tmdb.org/t/p/w185" + x.profile_path;
                    
                    jsx.push((
                        <Flex onClick={() => { selectChoice(x.name) }} className="search-field" gap={5} margin={4} _hover={{ background: "blackAlpha.300", cursor: "pointer" }} key={x.name}>
                            <Image height={"150"} className="celeb-pfp" src={imgSrc} fallbackSrc={"https://a.thumbs.redditmedia.com/J4ioz9jcdUdpkOYjMHGfRqf2qQcraEfjpKs9FgDtw_0.jpg"} />
                            <Box alignSelf={"center"}>{x.name}</Box>
                        </Flex>))
                }
                
            })

            
            setQuery(e.target.value)
            setResults(jsx)
        }
        else{
            setResults()
        }

    }



    //parse names by replacing spaces and periods with underscores
    const selectChoice = (name) => {
        console.log("Changing celeb to:", name);
        let underName = name.replaceAll(" ", "_").replaceAll(".", "");
        inputRef.current.value = name;
        searchRef.current.blur();
        setQuery(name);
        setCeleb(underName);
        setLoading(true);
    }

    return (
        <Box className="searchbar-container" tabIndex={0} marginX={"5%"} marginY={10} ref={searchRef} position={"relative"}>

            <Input background={"#FAEDCA"} className="searchbar-input" focusBorderColor='lime' spellCheck="false"  onChange={handleInput} defaultValue={query} ref={inputRef} />

            <Box roundedBottom={"md"} className="searchbar-box" position={"absolute"} zIndex={1} width={"100%"} boxShadow={"md"}>
                {results}
            </Box>
        </Box>
    )
}