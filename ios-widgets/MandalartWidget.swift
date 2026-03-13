import WidgetKit
import SwiftUI

// MARK: - Data Model
struct MandalartEntry: TimelineEntry {
    let date: Date
    let mainGoal: String
    let progress: Double
    let periodText: String
}

// MARK: - Provider
struct MandalartProvider: TimelineProvider {
    func placeholder(in context: Context) -> MandalartEntry {
        MandalartEntry(
            date: Date(),
            mainGoal: "목표를 설정하세요",
            progress: 0.0,
            periodText: "2024년"
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (MandalartEntry) -> ()) {
        let entry = MandalartEntry(
            date: Date(),
            mainGoal: "나의 목표",
            progress: 0.45,
            periodText: "2024년"
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<MandalartEntry>) -> ()) {
        let currentDate = Date()
        let entry = getDataFromSharedStorage()
        
        // 30분마다 업데이트
        let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 30, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
        completion(timeline)
    }
    
    private func getDataFromSharedStorage() -> MandalartEntry {
        // UserDefaults에서 데이터 가져오기 (App Group 사용)
        let defaults = UserDefaults(suiteName: "group.com.mandalart.app")
        
        let mainGoal = defaults?.string(forKey: "mainGoal") ?? ""
        let progress = defaults?.double(forKey: "progress") ?? 0.0
        let periodText = defaults?.string(forKey: "periodText") ?? ""
        
        return MandalartEntry(
            date: Date(),
            mainGoal: mainGoal.isEmpty ? "목표를 설정하세요" : mainGoal,
            progress: progress,
            periodText: periodText
        )
    }
}

// MARK: - Widget View
struct MandalartWidgetEntryView: View {
    var entry: MandalartProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            MediumWidgetView(entry: entry)
        }
    }
}

// MARK: - Small Widget
struct SmallWidgetView: View {
    var entry: MandalartEntry
    
    var body: some View {
        VStack(spacing: 8) {
            Text("만다라트")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(Color(red: 0.54, green: 0.6, blue: 0.67))
            
            Text(entry.mainGoal)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(red: 0.16, green: 0.23, blue: 0.29))
                .lineLimit(2)
                .multilineTextAlignment(.center)
            
            Text("\(Int(entry.progress * 100))%")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(red: 0.35, green: 0.6, blue: 0.78))
        }
        .padding()
        .containerBackground(for: .widget) {
            Color(red: 0.91, green: 0.91, blue: 0.91)
        }
    }
}

// MARK: - Medium Widget
struct MediumWidgetView: View {
    var entry: MandalartEntry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("만다라트")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(red: 0.35, green: 0.42, blue: 0.48))
                
                Spacer()
                
                Text(entry.periodText)
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 0.54, green: 0.6, blue: 0.67))
            }
            
            Text(entry.mainGoal)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(red: 0.16, green: 0.23, blue: 0.29))
                .lineLimit(2)
            
            Spacer()
            
            VStack(spacing: 4) {
                HStack {
                    Text("진행률")
                        .font(.system(size: 12))
                        .foregroundColor(Color(red: 0.35, green: 0.42, blue: 0.48))
                    
                    Spacer()
                    
                    Text("\(Int(entry.progress * 100))%")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(red: 0.35, green: 0.6, blue: 0.78))
                }
                
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color(red: 0.35, green: 0.6, blue: 0.78).opacity(0.2))
                            .frame(height: 6)
                        
                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color(red: 0.35, green: 0.6, blue: 0.78))
                            .frame(width: geometry.size.width * entry.progress, height: 6)
                    }
                }
                .frame(height: 6)
            }
        }
        .padding()
        .containerBackground(for: .widget) {
            Color(red: 0.91, green: 0.91, blue: 0.91)
        }
    }
}

// MARK: - Large Widget
struct LargeWidgetView: View {
    var entry: MandalartEntry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("만다라트")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(red: 0.35, green: 0.42, blue: 0.48))
                
                Spacer()
                
                Text(entry.periodText)
                    .font(.system(size: 14))
                    .foregroundColor(Color(red: 0.54, green: 0.6, blue: 0.67))
            }
            
            VStack(spacing: 8) {
                Text("메인 목표")
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 0.54, green: 0.6, blue: 0.67))
                
                Text(entry.mainGoal)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(Color(red: 0.16, green: 0.23, blue: 0.29))
                    .lineLimit(3)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            
            Spacer()
            
            // 진행률 섹션
            VStack(spacing: 8) {
                HStack {
                    Text("진행률")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(red: 0.35, green: 0.42, blue: 0.48))
                    
                    Spacer()
                    
                    Text("\(Int(entry.progress * 100))%")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(red: 0.35, green: 0.6, blue: 0.78))
                }
                
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color(red: 0.35, green: 0.6, blue: 0.78).opacity(0.2))
                            .frame(height: 8)
                        
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color(red: 0.35, green: 0.6, blue: 0.78))
                            .frame(width: geometry.size.width * entry.progress, height: 8)
                    }
                }
                .frame(height: 8)
            }
        }
        .padding()
        .containerBackground(for: .widget) {
            Color(red: 0.91, green: 0.91, blue: 0.91)
        }
    }
}

// MARK: - Widget Configuration
@main
struct MandalartWidget: Widget {
    let kind: String = "MandalartWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MandalartProvider()) { entry in
            MandalartWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("만다라트")
        .description("목표와 진행률을 한눈에 확인하세요")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - Preview
#Preview(as: .systemMedium) {
    MandalartWidget()
} timeline: {
    MandalartEntry(date: .now, mainGoal: "MLB 1군 선수가 되기", progress: 0.45, periodText: "2024년")
    MandalartEntry(date: .now, mainGoal: "건강한 몸 만들기", progress: 0.7, periodText: "2024년 3월")
}
