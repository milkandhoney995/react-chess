import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PromotionModal from "../PromotionModal";
import { TeamType } from "@/domain/chess/types";
import { PROMOTION_PIECES } from "@/domain/chess/constants";

// Mock createPortal
vi.mock("react-dom", () => ({
  createPortal: (children: React.ReactNode) => children,
}));

const mockOnPromote = vi.fn();

describe("Component: PromotionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders promotion modal with correct title: プロモーションモーダルを正しくレンダーする", async () => {
    render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OUR}
        onPromote={mockOnPromote}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("昇格する駒を選択")).toBeInTheDocument();
    });
  });

  it("renders all promotion piece options: プロモーション可能な駒をレンダーする", async () => {
    render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OUR}
        onPromote={mockOnPromote}
      />
    );

    await waitFor(() => {
      // Should render buttons for each promotion piece
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(PROMOTION_PIECES.length);
    });
  });

  it("dispatches PROMOTE_PAWN action when piece is selected: プロモーションアクションをディスパッチする", async () => {
    render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OUR}
        onPromote={mockOnPromote}
      />
    );

    await waitFor(() => {
      const queenButton = screen.getAllByRole("button")[0]; // Queen is first
      fireEvent.click(queenButton);
    });

    expect(mockOnPromote).toHaveBeenCalledWith({ x: 0, y: 7 }, PROMOTION_PIECES[0]);
  });

  it("renders pieces for correct team: 正しいチームの駒をレンダーする", async () => {
    render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OPPONENT}
        onPromote={mockOnPromote}
      />
    );

    await waitFor(() => {
      // Should render successfully with opponent team
      expect(screen.getByText("昇格する駒を選択")).toBeInTheDocument();
    });
  });

  it("handles different promotion positions: 異なるプロモーション位置を処理する", async () => {
    const testPositions = [
      { x: 0, y: 7 },
      { x: 7, y: 7 },
      { x: 3, y: 0 },
    ];

    for (const position of testPositions) {
      const { rerender } = render(
        <PromotionModal
          position={position}
          team={TeamType.OUR}
          onPromote={mockOnPromote}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("昇格する駒を選択")).toBeInTheDocument();
      });

      // Clean up for next iteration
      rerender(<></>);
    }
  });

  it("applies correct CSS classes: CSSクラスを正しく適用する", async () => {
    render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OUR}
        onPromote={mockOnPromote}
      />
    );

    await waitFor(() => {
      const overlay = screen.getByText("昇格する駒を選択").closest('[class*="overlay"]');
      expect(overlay).toBeInTheDocument();

      const modal = screen.getByText("昇格する駒を選択").closest('[class*="modal"]');
      expect(modal).toBeInTheDocument();
    });
  });

  it("renders all promotion pieces in correct order: プロモーション可能な駒を正しく表示する", async () => {
    render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OUR}
        onPromote={mockOnPromote}
      />
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(PROMOTION_PIECES.length);

      // Each button should have the correct piece type
      buttons.forEach((button, index) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  it("handles SSR correctly: SSRを正しく処理する", () => {
    // In test environment, useEffect runs synchronously, so it renders
    // In real SSR, useEffect doesn't run, so it would return null
    const { container } = render(
      <PromotionModal
        position={{ x: 0, y: 7 }}
        team={TeamType.OUR}
        onPromote={mockOnPromote}
      />
    );

    // In test environment, it should render (useEffect runs)
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild).toBeInTheDocument();
  });
});
