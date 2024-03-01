import { useParams } from "next/navigation";

const Batch: React.FC = () => {
  const params = useParams();

  console.log(params); // TODO

  return <div></div>;
};

export default Batch;
