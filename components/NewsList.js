import axios from 'axios';

const NewsList = async (data) => {
    const newsListContainer = document.createElement('div');
    newsListContainer.className = 'news-list-container';

    const newsListArticle = document.createElement('article');
    newsListArticle.className = 'news-list';
    newsListArticle.dataset.category = data.category;
    newsListContainer.appendChild(newsListArticle);

    const newsList = await getNewsList(data);
    newsList.forEach((item) => {
        newsListArticle.appendChild(item);
    });

    const scrollObserverElement = observerElement();

    newsListContainer.appendChild(scrollObserverElement);

    scrollObserver(newsListArticle, scrollObserverElement);


    return newsListContainer;
};


const getNewsList = async (page = 1, category) => {
    const newsArr = [];
    const pageSize = 5;
    const apiKey = '4ec3be9ae78b45979831f46f3462da36';
    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${category === 'all' ? '' : category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const articles = response.data.articles;

        articles.forEach((data) => {
            const urlToImage = data.urlToImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
            const description = data.description || '';

            const newsItem = document.createElement('section');
            newsItem.className = 'news-item';
            newsItem.insertAdjacentHTML('beforeend', `
                <div class="thumbnail">
                    <a href="${data.url}" target="_blank" rel="noopener noreferrer">
                        <img src="${urlToImage}" alt="thumbnail" />
                    </a>
                </div>
                <div class="contents">
                    <h2>
                        <a href="${data.url}" target="_blank" rel="noopener noreferrer">
                            ${data.title}
                        </a>
                    </h2>
                    <p>${description}</p>
                </div>
            `);
            newsArr.push(newsItem);
        });
        return newsArr;
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return [];
    }
};


const observerElement = () => {
    const observerElement = document.createElement('div');
    observerElement.className = 'scroll-observer';
    observerElement.dataset.page = '1';

    const observerImg = document.createElement('img');
    observerImg.src = './img/ball-triangle.svg';
    observerImg.alt = 'Loading...';

    observerElement.appendChild(observerImg);

    return observerElement;
};


const scrollObserver = (newsListArticle, scrollObserverElement) => {
    const callback = async (entries, observer) => {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
                const nextPage = parseInt(scrollObserverElement.dataset.page) + 1;
                const category = newsListArticle.dataset.category;
                const newsList = await getNewsList(nextPage, category);

                if (newsList.length > 0) {
                    newsList.forEach(item => newsListArticle.appendChild(item));
                    scrollObserverElement.dataset.page = nextPage;
                } else {
                    observer.unobserve(scrollObserverElement);
                    scrollObserverElement.remove();
                }
            }
        });
    };

    const observer = new IntersectionObserver(callback, { threshold: 0.5 });
    observer.observe(scrollObserverElement);
};


export default NewsList;
