import express from 'express';

const urlRouter = express.Router(); 


urlRouter.post('/generate', newUrl);

// for authenticate user 

urlRouter.get('/urls', totalUrl);
urlRouter.get('/urls/:id', currentUrl); 
urlRouter.patch('/urls/:id', updateUrl);
urlRouter.delete('/urls/:id', deleteUrl);

urlRouter.get('/:shortCode', actualurl );

export default urlRouter;