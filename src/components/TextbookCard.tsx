import { OutlineButton } from "./OutlineButton";

type TextbookCardProps = {
  image_url: string;
  title: string;
  isbn: string;
  onSelect: () => void;
};

const TextbookCard: React.FC<TextbookCardProps> = ({
  image_url,
  title,
  isbn,
  onSelect,
}) => {
  return (
    <div className="flex h-44 w-96">
      <div className="w-1/3">
        <img className="mt-0 h-44" src={image_url} alt={title} />
      </div>

      <div className="w-2/3 pl-8">
        <div className="text-white text-sm mt-2 ">{title}</div>
        <div className="text-white text-sm mt-2 ">ISBN: {isbn}</div>
        <OutlineButton
          className={"text-sm px-7 py-2 mt-8"}
          size="sm"
          onClick={onSelect}
        >
          Edit
        </OutlineButton>
      </div>
    </div>
  );
};

export default TextbookCard;
