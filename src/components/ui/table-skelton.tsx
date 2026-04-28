import { Skeleton } from "@mui/material";

export const GroupSkeleton = ({ rowsNum, height = 40 }: { rowsNum: number, height?: number }) => {
    return (
        <>
            {[...Array(rowsNum)].map((_, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", padding: 16 }}>
                    <Skeleton variant="rectangular" height={height} width={"100%"} animation="wave" sx={{
                        borderRadius: 2
                    }} />
                </div>
            ))}
        </>
    );
};
