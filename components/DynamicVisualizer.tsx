

interface DynamicVisualizerProps<TData> {
  data: TData;
  renderer: (data: TData) => React.ReactNode;
}

const DynamicVisualizer = <TData,>({
  data,
  renderer,
}: DynamicVisualizerProps<TData>) => {
  return <div className="h-full w-full">{renderer(data)}</div>;
};

export default DynamicVisualizer;