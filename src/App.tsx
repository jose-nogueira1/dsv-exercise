import React, { useReducer, useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import "./styles.css";
import usersData from "./data"; // Import the users data

// Define a type for a user
type User = {
  id: string;
  username: string;
  address: {
    street: string;
    suite: string;
    city: string;
  };
  age: number;
  companyName: string;
};

// Define the initial state for users, removed users, filtered users, and count
const initialState: {
  users: User[];
  removedUsers: User[];
  filteredUsers: User[];
  count: number;
  searchText: string;
} = {
  users: [],
  removedUsers: [],
  filteredUsers: [],
  count: 0,
  searchText: "",
};

// Define the reducer function
function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case "REMOVE_USER":
      const removedUser = state.users.find(
        (user) => user.id === action.payload
      );
      if (removedUser) {
        return {
          ...state,
          users: state.users.filter((user) => user.id !== action.payload),
          removedUsers: [...state.removedUsers, removedUser],
        };
      }
      return state;
    case "RESTORE_USER":
      const restoredUser = state.removedUsers.find(
        (user) => user.id === action.payload
      );
      if (restoredUser) {
        return {
          ...state,
          users: [...state.users, restoredUser],
          removedUsers: state.removedUsers.filter(
            (user) => user.id !== action.payload
          ),
        };
      }
      return state;
    case "SET_FILTERED_USERS":
      return {
        ...state,
        filteredUsers: action.payload,
      };
    case "INCREMENT_RANDOM":
      return {
        ...state,
        count: state.count + getRandomNumber(1, 10), // Increment count by a random number between 1 and 10
      };
    case "INCREMENT_NEAREST_ODD":
      return {
        ...state,
        count: incrementToNextOdd(state.count), // Increment to the nearest odd number
      };
    case "DECREMENT_COUNT":
      return {
        ...state,
        count: Math.max(0, state.count - action.payload),
      };
    case "RESET_COUNT":
      return {
        ...state,
        count: 0,
      };
    case "SET_SEARCH_TEXT":
      return {
        ...state,
        searchText: action.payload,
      };
    default:
      return state;
  }
}

// Function to get a random number between min and max (inclusive)
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to increment to the next odd number
function incrementToNextOdd(number: number) {
  return number % 2 === 0 ? number + 1 : number + 2;
}

function App() {
  // Initialize the state using the reducer
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize numberInput state variable
  const [numberInput, setNumberInput] = useState<number>(0);

  // Load users data from data.ts
  useEffect(() => {
    // Filter users where age >= 18
    const filteredUsers = usersData.filter((user) => user.age >= 18);

    // Map users data to include required properties and add a randomized ID
    const mappedUsers = filteredUsers.map((user) => ({
      id: generateRandomId(),
      username: user.username,
      address: user.address,
      age: user.age,
      companyName: user.company.name,
    }));

    // Sort the array by age, then by companyName
    mappedUsers.sort((a, b) => {
      if (a.age === b.age) {
        return a.companyName.localeCompare(b.companyName);
      }
      return a.age - b.age;
    });

    // Dispatch the data to the local users state
    mappedUsers.forEach((user) =>
      dispatch({ type: "ADD_USER", payload: user })
    );
  }, []);

  // Generate a random ID of length 6
  const generateRandomId = () => {
    const characters = "ABCDEF123456";
    let id = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  };

  // Handle the search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value.toLowerCase();

    // Dispatch the action to set searchText
    dispatch({ type: "SET_SEARCH_TEXT", payload: searchText });
  };

  // Filter the users based on the search text
  const filteredUsers = state.users.filter((user) =>
    user.username.toLowerCase().includes(state.searchText)
  );

  return (
    <div className="App">
      <p style={{ marginBottom: 0 }}>Count: {state.count}</p>
      <Button
        variant="contained"
        onClick={() => dispatch({ type: "INCREMENT_RANDOM" })}
      >
        Increment Random
      </Button>
      <Button
        variant="contained"
        onClick={() => dispatch({ type: "INCREMENT_NEAREST_ODD" })}
      >
        Increment Nearest Odd
      </Button>
      <TextField
        defaultValue={numberInput}
        type="number"
        style={{ display: "block" }}
      />
      <Button
        variant="contained"
        onClick={() =>
          dispatch({ type: "DECREMENT_COUNT", payload: numberInput })
        }
      >
        Decrease Count
      </Button>
      <Button
        variant="contained"
        onClick={() => dispatch({ type: "RESET_COUNT" })}
      >
        Reset Count
      </Button>

      <p style={{ marginBottom: 0, marginTop: 30 }}>Search for a user</p>
      <TextField
        onChange={handleSearchChange}
        value={state.searchText} // Use searchText from the state
        style={{ display: "block", margin: "auto" }}
      />
      {/* Render the filtered users */}
      {filteredUsers.map((user) => (
        <Card key={user.id} style={{ marginTop: 20 }}>
          <CardContent>
            <Typography variant="h6">{user.username}</Typography>
            <Typography>{user.address.street}</Typography>
            <Typography>{user.age}</Typography>
            <Typography>{user.companyName}</Typography>
            <Button
              variant="outlined"
              onClick={() =>
                dispatch({ type: "REMOVE_USER", payload: user.id })
              }
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default App;
