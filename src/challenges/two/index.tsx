import {
  Box,
  Input,
  Flex,
  VStack,
  SkeletonText,
  SkeletonCircle,
  SimpleGrid,
  Image,
  Link
} from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import React, { useEffect, useState } from "react";

// putting this here as a guide for what the API returns
// and what you need from it.
interface Show {
  score: number;
  show: {
    id: number;
    name: string;
    type: string;
    genres: string[];
    image?: {
      medium: string;
    };
    summary: string;
  };
}

function ShowCard({
  shows,
  loading,
  success
}: {
  shows: object;
  loading: boolean;
  success: boolean;
}) {
  // 💡 use this link below for placeholder images.
  // "https://via.placeholder.com/112x157.png?text=No+image"

  // 💡 A few hints:
  // genres use the Tag component
  // loading placeholders use the Skeleton component
  // both from @chakra-ui/react
  // use the docs: https://chakra-ui.com/docs/getting-started

  const data = Object.entries(shows)?.map((data) => {
    return data[1];
  });

  const getShows = data?.map((showData) => {
    return showData.show;
  });

  return (
    <Flex
      w="full"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      shadow="sm"
      _hover={{
        cursor: "pointer",
        shadow: "lg"
      }}
      p={2}
    >
      {loading && (
        <>
          <Box padding="6" boxShadow="lg" bg="white" mr="5">
            <SkeletonCircle size="20" />
            <SkeletonText
              mt="4"
              noOfLines={5}
              width="28"
              spacing="4"
              skeletonHeight="5"
            />
          </Box>
          <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonCircle size="20" />
            <SkeletonText
              mt="4"
              noOfLines={6}
              width="28"
              spacing="4"
              skeletonHeight="5"
            />
          </Box>
        </>
      )}
      {!loading && shows && (
        <SimpleGrid columns={2} spacing={1}>
          {getShows &&
            getShows?.map((myShow, index) => {
              return (
                <Box height="auto" spacing={5}>
                  <Link href={myShow?.url} isExternal>
                    <Image
                      height="auto"
                      src={myShow?.image?.original}
                      alt={myShow?.name}
                    />
                  </Link>
                  <h5>
                    <b>Title: </b>
                    {myShow?.name}
                  </h5>
                  <h5>
                    <b>Status: </b>
                    {myShow?.status}
                  </h5>
                  <h5>
                    <b>Language: </b>
                    {myShow?.language}
                  </h5>
                  <h5>
                    <b>Genre: </b>
                    {myShow?.genres.toString()}
                  </h5>
                  <h5>
                    <b>Average Runtime: </b>
                    {myShow?.averageRuntime} minutes
                  </h5>
                  <h4
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      color: "Red"
                    }}
                  >
                    <Link href={myShow?.url} isExternal>
                      <b>Click for Details </b>
                    </Link>
                  </h4>
                </Box>
              );
            })}
        </SimpleGrid>
      )}
    </Flex>
  );
}

export default function Two() {
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 200);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // I've debounced the input for you just
  // use 'searchValue' to trigger a request to the search API
  // https://api.tvmaze.com/search/shows?q=:searchValue

  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const getShows = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=:${searchValue}`
        );
        const data = await response.json();
        setShows(data);
        setSuccess(data.length > 0);
        // the delay function is to simulate the delays in the api request response
        // as is, the loading state toggles to true too fast for the skeleton to render
        await delay(3000);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setSuccess(false);
        console.error("Error Fetching Data:", error);
      }
    };

    if (searchValue.trim() !== "") {
      getShows();
    } else {
      setShows([]);
      setLoading(false);
      setSuccess(false);
    }
  }, [searchValue]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Box>
      <Input
        type="text"
        placeholder="Search for a TV show"
        onChange={(e) => onInputChange(e)}
        value={searchValue}
      />
      <VStack spacing={4} mt={6}>
        {searchValue.trim() === "" && (
          <p>Nothing here. Try searching for a TV show above!</p>
        )}
        {success && (
          <ShowCard shows={shows} loading={loading} success={success} />
        )}
        {!success && !loading && searchValue.trim() !== "" && (
          <p>No results for "{searchValue}"</p>
        )}
      </VStack>
    </Box>
  );
}
