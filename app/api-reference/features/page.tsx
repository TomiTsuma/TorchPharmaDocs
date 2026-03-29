import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Features Module | Torch Pharma",
  description: "Geometric utilities, ScalarVector, and centralization functions",
}

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Features</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.features</code> — Geometric utilities for equivariant molecular representations
      </p>

      <p className="mb-6">
        The features module provides data structures and geometry functions that underpin geometric
        message passing in torch_pharma. Everything can be imported directly from{" "}
        <code>torch_pharma.features</code>.
      </p>

      <pre className="mb-8 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`from torch_pharma.features import (
    ScalarVector,   # dual scalar + vector representation
    centralize,     # subtract center of gravity
    decentralize,   # add back center of gravity
    localize,       # build local SE(3) frames per edge
    scalarize,      # project vectors into scalar via frames
    vectorize,      # lift scalars back into 3D vectors via frames
    safe_norm,      # numerically stable L2 norm
    is_identity,    # check if a nonlinearity is identity
    get_nonlinearity, # instantiate activation by name
)`}</code>
      </pre>

      {/* --- ScalarVector --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>ScalarVector</code>
      </h2>
      <p className="mb-4">
        A named tuple subclass that carries a pair of tensors: <strong>scalar</strong> (shape{" "}
        <code>[N, s]</code>) and <strong>vector</strong> (shape <code>[N, v, 3]</code>). It overloads
        arithmetic operators so that vector-type operations stay consistent across both channels.
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Method / Property</th>
              <th className="px-4 py-2 text-left">Returns</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">.scalar</td>
              <td className="px-4 py-2">Tensor</td>
              <td className="px-4 py-2">First element (scalar channel)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">.vector</td>
              <td className="px-4 py-2">Tensor</td>
              <td className="px-4 py-2">Second element (vector channel)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">__add__(other)</td>
              <td className="px-4 py-2">ScalarVector</td>
              <td className="px-4 py-2">Element-wise addition of both channels</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">__mul__(other)</td>
              <td className="px-4 py-2">ScalarVector</td>
              <td className="px-4 py-2">Element-wise or scalar multiplication of both channels</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">concat(others, dim=-1)</td>
              <td className="px-4 py-2">(Tensor, Tensor)</td>
              <td className="px-4 py-2">torch.cat of scalars along dim, and of vectors along dim</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">flatten()</td>
              <td className="px-4 py-2">Tensor</td>
              <td className="px-4 py-2">Reshape vector to <code>[N, 3v]</code> and cat with scalar → <code>[N, s+3v]</code></td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">ScalarVector.recover(x, vector_dim)</td>
              <td className="px-4 py-2">ScalarVector</td>
              <td className="px-4 py-2">Inverse of flatten: split flat tensor back into (s, v, 3) pair</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">.vs()</td>
              <td className="px-4 py-2">(Tensor, Tensor)</td>
              <td className="px-4 py-2">Unpack to (scalar, vector) tuple</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">.idx(idx)</td>
              <td className="px-4 py-2">ScalarVector</td>
              <td className="px-4 py-2">Index both channels with the same index tensor</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">.mask(node_mask)</td>
              <td className="px-4 py-2">ScalarVector</td>
              <td className="px-4 py-2">Zero-out masked rows in both channels</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">.clone()</td>
              <td className="px-4 py-2">ScalarVector</td>
              <td className="px-4 py-2">Deep copy both channels</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- centralize / decentralize --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>centralize</code> / <code>decentralize</code>
      </h2>
      <p className="mb-4">
        Center-of-gravity (CoG) operations required for translation-invariant and equivariant diffusion.
      </p>
      <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`centroid, x_centered = centralize(
    batch,           # torch_geometric Batch with attribute <key>
    key="x",         # attribute to centralize
    batch_index,     # [N] long tensor indicating graph membership
    node_mask=None,  # optional bool mask; masked nodes are excluded from mean
    edm=False        # if True: uses node_mask-weighted sum (EDM-style)
)

x_restored = decentralize(batch, key="x", batch_index, centroid, node_mask, edm)`}</code>
      </pre>
      <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950">
        <strong>EDM mode:</strong> When <code>edm=True</code>, the function asserts that masked node
        values are negligibly small (abs sum &lt; 1e-5), then computes the mean over only unmasked nodes
        using a mask-weighted sum/count. This is the required mode during EVD training.
      </div>

      {/* --- localize --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>localize</code>
      </h2>
      <p className="mb-4">
        Builds a per-edge orthonormal frame <em>f_ij</em> from node positions. Each frame is a{" "}
        <code>[E, 3, 3]</code> tensor whose columns are:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`x_diff     = normalize(x_i - x_j)          # direction vector
x_cross    = normalize(x_i × x_j)          # perpendicular to the plane
x_vertical = x_diff × x_cross              # third orthogonal axis
f_ij = cat([x_diff, x_cross, x_vertical], dim=1)   # (E, 3, 3)`}</code>
      </pre>
      <p className="mb-6">
        Setting <code>norm_x_diff=True</code> (default) normalizes both difference and cross product by
        their norms + 1 to avoid division by zero.
      </p>

      {/* --- scalarize / vectorize --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>scalarize</code> / <code>vectorize</code>
      </h2>
      <p className="mb-4">
        Convert between vector and scalar representations using local frames, enabling direction-aware
        geometric information flow in GCPNet.
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Function</th>
              <th className="px-4 py-2 text-left">Input</th>
              <th className="px-4 py-2 text-left">Output</th>
              <th className="px-4 py-2 text-left">Operation</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">scalarize</td>
              <td className="px-4 py-2">[E or N, 3, 3] vector</td>
              <td className="px-4 py-2">[E or N, 9] scalar</td>
              <td className="px-4 py-2">Local matmul: frames @ vector, reshape → 9 scalars per entity</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">vectorize</td>
              <td className="px-4 py-2">[E or N, 9] gate scalar</td>
              <td className="px-4 py-2">[E or N, 3, 3] vector</td>
              <td className="px-4 py-2">
                Reconstruct 3D vectors as weighted combinations of the three frame axes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-6">
        Both support <code>node_inputs=True</code> to scatter-aggregate edge results onto nodes, and an
        optional <code>node_mask</code> for batched graphs with padding.
      </p>

      {/* --- batch.py --- */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        <code>features.batch</code>
      </h2>
      <p className="mb-6">
        Thin wrapper that re-exports PyG utilities for batch index manipulation used across multiple
        modules.
      </p>
    </main>
  )
}
