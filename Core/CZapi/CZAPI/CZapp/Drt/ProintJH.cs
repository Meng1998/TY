using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace CZapp.Drt
{
    public static class myExtendLine2D
    {
        /// <summary>
        /// 判断两个线段（不延长）之间是否相交，如果相交给出相交的点。（使用了MathNet.Spatial库，来自NuGet）
        /// </summary>
        /// <param name="segmentline1"></param>
        /// <param name="segmentline2"></param>
        /// <returns></returns>
        public static Point2D? IntersecWithSegmentLine(this Line2D segmentline1, Line2D segmentline2)
        {
            Point2D? intersecPoint = segmentline1.IntersectWith(segmentline2);
            if (intersecPoint.Equals(null))
                return null;
            if (intersecPoint.Value.X > Math.Max(segmentline1.StartPoint.X, segmentline1.EndPoint.X) ||
                intersecPoint.Value.X < Math.Min(segmentline1.StartPoint.X, segmentline1.EndPoint.X) ||
                intersecPoint.Value.X > Math.Max(segmentline2.StartPoint.X, segmentline2.EndPoint.X) ||
                intersecPoint.Value.X < Math.Min(segmentline2.StartPoint.X, segmentline2.EndPoint.X) ||
                intersecPoint.Value.Y > Math.Max(segmentline1.StartPoint.Y, segmentline1.EndPoint.Y) ||
                intersecPoint.Value.Y < Math.Min(segmentline1.StartPoint.Y, segmentline1.EndPoint.Y) ||
                intersecPoint.Value.Y > Math.Max(segmentline2.StartPoint.Y, segmentline2.EndPoint.Y) ||
                intersecPoint.Value.Y < Math.Min(segmentline2.StartPoint.Y, segmentline2.EndPoint.Y)
                )
            {
                return null;
            }

            return intersecPoint;
        }

        ///// <summary>
        ///// 线段是否相交
        ///// </summary>
        ///// <param name="p1">线段P1P2的P1点</param>
        ///// <param name="p2">线段P1P2的P2点</param>
        ///// <param name="q1">线段Q1Q2的Q1点</param>
        ///// <param name="q2">线段Q1Q2的Q2点</param>
        ///// <returns></returns>
        //public static bool IsIntersect(PointF p1, PointF p2, PointF q1, PointF q2)
        //{
        //    //排斥试验，判断p1p2在q1q2为对角线的矩形区之外
        //    if (Math.Max(p1.X, p2.X) < Math.Min(q1.X, q2.X))
        //    {//P1P2中最大的X比Q1Q2中的最小X还要小，说明P1P2在Q1Q2的最左点的左侧，不可能相交。
        //        return false;
        //    }

        //    if (Math.Min(p1.X, p2.X) > Math.Max(q1.X, q2.X))
        //    {//P1P2中最小的X比Q1Q2中的最大X还要大，说明P1P2在Q1Q2的最右点的右侧，不可能相交。
        //        return false;
        //    }

        //    if (Math.Max(p1.Y, p2.Y) < Math.Min(q1.Y, q2.Y))
        //    {//P1P2中最大的Y比Q1Q2中的最小Y还要小，说明P1P2在Q1Q2的最低点的下方，不可能相交。
        //        return false;
        //    }

        //    if (Math.Min(p1.Y, p2.Y) > Math.Max(q1.Y, q2.Y))
        //    {//P1P2中最小的Y比Q1Q2中的最大Y还要大，说明P1P2在Q1Q2的最高点的上方，不可能相交。
        //        return false;
        //    }

        //    //跨立试验
        //    var crossP1P2Q1 = VectorKits.Cross(p1, p2, q1);
        //    var crossP1Q2P2 = VectorKits.Cross(p1, q2, p2);
        //    var crossQ1Q2P1 = VectorKits.Cross(q1, q2, p1);
        //    var crossQ1P2Q2 = VectorKits.Cross(q1, p2, q2);

        //    bool isIntersect = (crossP1P2Q1 * crossP1Q2P2 >= 0) && (crossQ1Q2P1 * crossQ1P2Q2 >= 0);
        //    return isIntersect;
        //}

    }
}
