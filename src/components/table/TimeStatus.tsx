import { RxUpdate } from "react-icons/rx";
import TimeAgo from "react-timeago";

export default function TimeStatus({
  createdAt,
  lastUpdated,
}: {
  createdAt?: Date;
  lastUpdated?: Date;
}) {
  return (
    <div className="flex flex-col">
      {createdAt && (
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-light text-neutral-300">created</span>
          <TimeAgo date={createdAt} />
        </div>
      )}
      <div className="flex items-center gap-1 text-blue-300">
        {lastUpdated && (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-light text-neutral-300">
                updated
              </span>
              <TimeAgo date={lastUpdated} />
            </div>
            <RxUpdate />
          </>
        )}
      </div>
    </div>
  );
}
