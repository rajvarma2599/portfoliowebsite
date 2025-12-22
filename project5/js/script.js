// Mock data for demonstration
const mockPosts = [
    {
        id: 1,
        user: 'John Doe',
        avatar: 'https://via.placeholder.com/50',
        content: 'Just finished an amazing workout! Feeling energized and ready for the day. 💪 #Fitness #MorningRoutine',
        image: 'https://via.placeholder.com/500x300',
        likes: 24,
        comments: 5,
        timestamp: '2 hours ago'
    },
    {
        id: 2,
        user: 'Jane Smith',
        avatar: 'https://via.placeholder.com/50',
        content: 'Beautiful sunset at the beach today. Nature never ceases to amaze me. 🌅',
        image: 'https://via.placeholder.com/500x300',
        likes: 42,
        comments: 8,
        timestamp: '4 hours ago'
    },
    {
        id: 3,
        user: 'Bob Johnson',
        avatar: 'https://via.placeholder.com/50',
        content: 'Excited to announce the launch of our new product! Check it out and let me know what you think.',
        likes: 67,
        comments: 12,
        timestamp: '6 hours ago'
    }
];

const mockFriends = [
    { name: 'Alice Brown', avatar: 'https://via.placeholder.com/40', mutualFriends: 12 },
    { name: 'Charlie Wilson', avatar: 'https://via.placeholder.com/40', mutualFriends: 8 },
    { name: 'Diana Prince', avatar: 'https://via.placeholder.com/40', mutualFriends: 15 }
];

const mockTrending = [
    '#FitnessGoals',
    '#BeachVibes',
    '#NewProduct',
    '#TechNews',
    '#WeekendVibes'
];

// DOM elements
const postsFeed = document.getElementById('posts-feed');
const postInput = document.getElementById('post-input');
const postSubmit = document.getElementById('post-submit');
const friendSuggestions = document.getElementById('friend-suggestions');
const trendingList = document.getElementById('trending-list');
const postModal = document.getElementById('post-modal');
const modalPostContent = document.getElementById('modal-post-content');
const commentsSection = document.getElementById('comments-section');
const closeBtn = document.querySelector('.close');

// Initialize the app
function init() {
    displayPosts();
    displayFriendSuggestions();
    displayTrendingTopics();
    setupEventListeners();
}

// Display posts
function displayPosts() {
    postsFeed.innerHTML = '';
    mockPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.avatar}" alt="${post.user}" class="avatar">
                <div class="post-user-info">
                    <h4>${post.user}</h4>
                    <span>${post.timestamp}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post image"></div>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost(${post.id})">
                    <i class="fas fa-heart"></i> ${post.likes}
                </button>
                <button class="action-btn" onclick="commentPost(${post.id})">
                    <i class="fas fa-comment"></i> ${post.comments}
                </button>
                <button class="action-btn" onclick="sharePost(${post.id})">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;
        postsFeed.appendChild(postCard);
    });
}

// Display friend suggestions
function displayFriendSuggestions() {
    friendSuggestions.innerHTML = '';
    mockFriends.forEach(friend => {
        const suggestion = document.createElement('div');
        suggestion.className = 'friend-suggestion';
        suggestion.innerHTML = `
            <img src="${friend.avatar}" alt="${friend.name}" class="avatar">
            <div>
                <h4>${friend.name}</h4>
                <span>${friend.mutualFriends} mutual friends</span>
            </div>
            <button class="btn-follow" onclick="followUser('${friend.name}')">Follow</button>
        `;
        friendSuggestions.appendChild(suggestion);
    });
}

// Display trending topics
function displayTrendingTopics() {
    trendingList.innerHTML = '';
    mockTrending.forEach(topic => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="searchTopic('${topic}')">${topic}</a>`;
        trendingList.appendChild(li);
    });
}

// Setup event listeners
function setupEventListeners() {
    postSubmit.addEventListener('click', createPost);
    postInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            createPost();
        }
    });

    closeBtn.addEventListener('click', () => {
        postModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === postModal) {
            postModal.style.display = 'none';
        }
    });
}

// Create new post
function createPost() {
    const content = postInput.value.trim();
    if (content) {
        const newPost = {
            id: Date.now(),
            user: 'You',
            avatar: 'https://via.placeholder.com/50',
            content: content,
            likes: 0,
            comments: 0,
            timestamp: 'Just now'
        };
        mockPosts.unshift(newPost);
        displayPosts();
        postInput.value = '';
        showNotification('Post created successfully!');
    }
}

// Like post
function likePost(postId) {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        displayPosts();
    }
}

// Comment on post
function commentPost(postId) {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
        postModal.style.display = 'block';
        modalPostContent.textContent = post.content;
        displayComments(postId);
    }
}

// Share post
function sharePost(postId) {
    navigator.clipboard.writeText(`Check out this post: ${window.location.href}#post-${postId}`);
    showNotification('Post link copied to clipboard!');
}

// Follow user
function followUser(name) {
    showNotification(`You are now following ${name}!`);
}

// Search topic
function searchTopic(topic) {
    showNotification(`Searching for ${topic}...`);
}

// Display comments
function displayComments(postId) {
    const post = mockPosts.find(p => p.id === postId);
    commentsSection.innerHTML = `
        <h4>Comments</h4>
        ${Array(post.comments).fill().map((_, i) => `
            <div class="comment">
                <img src="https://via.placeholder.com/35" alt="Commenter" class="avatar">
                <div class="comment-content">
                    <h5>User ${i + 1}</h5>
                    <span>2 hours ago</span>
                    <p>This is a sample comment on the post.</p>
                </div>
            </div>
        `).join('')}
    `;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1877f2;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
