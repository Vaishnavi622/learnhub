const API_URL = "http://localhost:3000";
export async function getUser(id){
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok){
        throw new Error("Failed to fetch user");
    }
    return response.json();
}

export async function updateUser(user){
    const response = await fetch(`${API_URL}/users/${user.id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(user),
    });
    if (!response.ok){
        throw new Error("Failed to update user");
    }
    return response.json();
}