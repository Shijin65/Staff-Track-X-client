import { Skeleton } from "@mui/material";

export const TableLoaderSkeleton = ({ rowsNum }: { rowsNum: number }) => {
    return (
        <>
            {[...Array(rowsNum)].map((_, index) => (
                <div key={index}>
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="rectangular" height={60} />
                </div>
            ))}
        </>
    );
};
