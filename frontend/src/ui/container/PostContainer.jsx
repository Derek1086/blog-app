const PostContainer = ({ children }) => {
  return (
    <div className="px-8 md:px-[200px] flex flex-wrap gap-2.5 mt-2.5">
      {children}
    </div>
  );
};

export default PostContainer;
