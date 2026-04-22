import { Skeleton } from "@mui/material";

export const GroupSkeleton = ({ rowsNum }: { rowsNum: number }) => {
    return (
        <>
            {[...Array(rowsNum)].map((_, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", padding: 16 }}>
                    <Skeleton variant="rectangular" height={40} width={"100%"} animation="wave" sx={{ borderRadius: 2 }} />
                </div>
            ))}
        </>
    );
};
