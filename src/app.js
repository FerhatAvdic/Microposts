import { http } from './http';
import { ui } from './ui';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);
// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);
// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);
// Listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);
// Listen for cancel edit state
document.querySelector('.card-form').addEventListener('click', cancelEdit);

// Get Posts
function getPosts() {
    http.get('http://localhost:3000/posts')
        .then(data => ui.showPosts(data))
        .catch(err => console.log(err));
}

// Submit Posts
function submitPost(){
    const title = ui.titleInput.value;
    const body = ui.bodyInput.value;
    const id = ui.idInput.value;

    const data = {
        title,
        body
    }

    if (title === '' || body === ''){
        ui.showAlert('Please fill in all fields', 'alert alert-danger');
    } else {

        // Check for ID
        if (id === ''){
            // Create post
            http.post('http://localhost:3000/posts', data)
                .then(data => {
                    ui.showAlert('Post Added', 'alert alert-success');
                    ui.clearFields();
                    getPosts();
                })
                .catch(err => console.log(err));
        } else {
            // Edit Post
            http.put(`http://localhost:3000/posts/${id}`, data)
                .then(data => {
                    ui.showAlert('Post Updated', 'alert alert-success');
                    ui.changeFormState('add');
                    getPosts();
                })
                .catch(err => console.log(err));
        }

        
    }
   
}

// Enable Edit State
function enableEdit(e){
    if(e.target.parentElement.classList.contains('edit')){
        const id = e.target.parentElement.dataset.id;
        const body = e.target.parentElement.previousElementSibling.textContent;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        
        const data = {
            id,
            body,
            title
        }

        ui.fillForm(data);
    }
    

}

function cancelEdit(e){
    if(e.target.classList.contains('post-cancel')){
        ui.changeFormState('add');
    }
    e.preventDefault();
}

function deletePost(e){
    if (e.target.parentElement.classList.contains('delete')) {
        const id = e.target.parentElement.dataset.id;
        if(confirm('Are you sure')){
            http.delete(`http://localhost:3000/posts/${id}`)
                .then(data => {
                    ui.showAlert('Post removed', 'alert alert-success');
                    getPosts();
                })
                .catch(err => console.log(err));
        }
    }
}