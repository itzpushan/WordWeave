import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog | null }) => {
  if (!blog) return <p>Blog not found</p>;

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-2xl">
          <div className="col-span-8">
            <div className="text-5xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500 pt-2">Posted on 2nd April 2025</div>
            <div> {blog.content} </div>
          </div>
          <div className="col-span-4">
            Author
            <div className="flex">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar name={blog.author.name}></Avatar>
              </div>
              <div className="text-xl font-bold">{blog.author.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
