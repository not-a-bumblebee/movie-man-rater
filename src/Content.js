import {
    Image, Box, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Divider,
    Heading,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"


export default function Content({ celeb, setLoading }) {

    const [bio, setBio] = useState()
    const [resume, setResume] = useState()
    const [averages, setAverages] = useState();

    const rottenTomatoIcons = {
        upright: "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/audience/aud_score-fresh.6c24d79faaf.svg",
        fresh: "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg",
        "certified-fresh": "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/certified_fresh-notext.56a89734a59.svg",
        spilled: "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/audience/aud_score-rotten.f419e4046b7.svg",
        rotten: "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg"
    }

    console.log("Celeb page rendered");
    console.log("averages", averages);
    console.log("resume", resume);
    console.log("bio", bio);

    const getData = async () => {
        let stuff = await (await fetch("https://movie-man-rater-api.onrender.com/api/scrape/" + celeb)).json()
        console.log("fetched data", stuff);

        let criticSum = 0;
        let audienceSum = 0;

        //Formats the box office dollars.   Ex  2,000   ==>  2K ;        2,000,000   ==> 2M
        let formatter = Intl.NumberFormat('en', { notation: 'compact' });
        
        //processing table data webscraped from RT.
        let parsedWork = stuff.works.map(x => {
            
            criticSum += x.critic_rating;
            audienceSum += x.audience_rating;
            x.box_office = formatter.format(x.box_office)
            
            x.critic_rating = (
                <Flex className="critic-rating">
                    <img src={rottenTomatoIcons[x.critic_icon]} alt={x.critic_icon + " icon"} />
                    <span className="score">{x.critic_rating}%</span>
                </Flex>
            )
            x.audience_rating = (
                <Flex className="audience-rating">
                    <img src={rottenTomatoIcons[x.audience_icon]} alt={x.audience_icon + " icon"} />
                    <span className="score">{x.audience_rating}%</span>
                </Flex>
            )
            return x;

        })


        //Calculating the Averages.
        let criticAvg = Math.round(criticSum / stuff.works.length);
        let audienceAvg = Math.round(audienceSum / stuff.works.length)

        let a = (
            <Flex className="critic-rating average-score">
                {(criticAvg >= 60) && (<img src={rottenTomatoIcons.fresh} alt="critic certified fresh icon" />)}
                {(criticAvg < 60) && (<img src={rottenTomatoIcons.rotten} alt="critic rotten icon" />)}
                
                <span className="score">{criticAvg}%</span>
            </Flex>
        )
        let b = (
            <Flex className="audience-rating average-score">
                {(audienceAvg >= 60) && (<img src={rottenTomatoIcons.upright} alt="audience fresh icon" />)}
                {(audienceAvg < 60) && (<img src={rottenTomatoIcons.spilled} alt="audience rotten icon" />)}
                <span className="score">{audienceAvg}%</span>
            </Flex>
        )

        console.log("Parsed Work:", parsedWork);


        setBio(stuff.bio);
        setResume(parsedWork);
        setAverages({
            critic: a,
            audience: b
        });
        setLoading(false);

    }


    useEffect(() => {
        //Set Bio to undefined, so that this component shows nothing while everything gets loaded.
        setBio(undefined)
        console.log("Use effect started");
        getData();

    }, [celeb])


//Only renders content if there is a bio.

    return (
        <>
            {bio &&
                <Flex boxShadow={"lg"} rounded={"2xl"} backgroundColor={"#C1DBB3"} direction="column" align={"center"} className="celeb-page-container">

                    <Flex className="celeb-header">

                        <Flex className="pfp-name" boxShadow={"md"} rounded={"lg"} backgroundColor={"#F2C078"} direction="column" margin={35} padding={"20px"} align={"center"}>
                            <Image src={bio.pfp} alt="celebrity profile picture" className="pfp" />
                            <Heading textAlign={"center"} fontFamily={"Inter"}>{bio.name}</Heading>
                        </Flex>
                        
                        <Box paddingTop={"2%"} className="celeb-stats-block">

                            <Flex margin={"20px 40px"} justify={"center"} direction="column" className="celeb-stats" boxShadow={"md"} rounded={"lg"} backgroundColor={"#FAEDCA"} padding={"2%"} width={"30em"}>
                                <StatGroup>
                                    <Stat>
                                        <StatLabel>Highest Rated Work:</StatLabel>
                                        <StatLabel><a href={"https://www.rottentomatoes.com/" + bio.best_movie.href}>{bio.best_movie.name}</a></StatLabel>
                                        <StatNumber>
                                            <Flex className="score">
                                                {bio.best_movie.icon && <img src={rottenTomatoIcons[bio.best_movie.icon]} alt={bio.best_movie.icon} />}
                                                {(bio.best_movie.icon && bio.best_movie.score.toString() + "%") || "Not Available"}
                                            </Flex>
                                        </StatNumber>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Lowest Rated Work</StatLabel>
                                        <StatLabel> <a href={"https://www.rottentomatoes.com/" + bio.worst_movie.href}>{bio.worst_movie.name}</a></StatLabel>
                                        <StatNumber>
                                            <Flex className="score">
                                                {bio.worst_movie.icon && <img src={rottenTomatoIcons[bio.worst_movie.icon] } alt={bio.worst_movie.icon} />}
                                                {(bio.worst_movie.icon && bio.worst_movie.score.toString() + "%") || "Not Available"}
                                            </Flex>
                                        </StatNumber>
                                    </Stat>
                                </StatGroup>
                            </Flex>
                            <Flex margin={"20px 40px"} justify={"center"} direction="column" className="celeb-stats" boxShadow={"md"} rounded={"lg"} backgroundColor={"#FAEDCA"} padding={"2%"} width={"30em"}>
                                <StatGroup>
                                    <Stat>
                                        <StatLabel>Average Critic Score:</StatLabel>
                                        <StatNumber>{averages.critic}</StatNumber>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Average Audience Score</StatLabel>
                                        <StatNumber>{averages.audience}</StatNumber>
                                    </Stat>
                                </StatGroup>
                            </Flex>
                        </Box>
                    </Flex>
                    <Divider size={"md"} />
                    <div className="celeb-biography">
                        <Text margin={"20px 40px"} backgroundColor={"#FAEDCA"} boxShadow={"md"} rounded={"lg"} textIndent={"2em"} padding={"1em"}  >
                            {bio.biography}
                        </Text>
                    </div>

                    <Divider size={"md"} />

                    <Box className="etc" backgroundColor={"#FAEDCA"} boxShadow={"md"} rounded={"lg"} marginBottom={"5%"} marginTop={"5%"} overflowX={"auto"} maxWidth={"100%"}>

                        <TableContainer margin={"44px"} overflowX={"auto"} >
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Critic Score</Th>
                                        <Th>Audience Score</Th>
                                        <Th>Title</Th>
                                        <Th>Credit</Th>
                                        <Th>Box Office</Th>
                                        <Th>Year</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {resume.map(x => {
                                        return (
                                            <Tr>
                                                <Td>{x.critic_rating}</Td>
                                                <Td>{x.audience_rating}</Td>
                                                <Td><a href={"https://www.rottentomatoes.com/" + x.href}>{x.name}</a></Td>
                                                <Td>{x.role}</Td>
                                                <Td>{ x.box_office !=="0" && "$"+x.box_office}</Td>
                                                <Td>{x.year}</Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>

                    </Box>
                </Flex>}
        </>
    )

}